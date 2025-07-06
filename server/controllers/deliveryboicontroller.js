import jwt from 'jsonwebtoken';
import DeliveryBoy from "../models/deliveryboi.js"
import Delivery from '../models/Delivery.js';
import UserInfo from '../models/Userinformation.js';
import cloudinary from 'cloudinary';
import streamifier from 'streamifier';
import dotenv from "dotenv"
import Subscription from '../models/Subscription.js';
// Configure Cloudinary (you might already have this elsewhere)
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary upload helper function
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder: 'delivery_boys',
        resource_type: 'auto'
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

// Updated registerDeliveryBoy controller
export const registerDeliveryBoy = async (req, res) => {
  try {
    const { name, phone, password, serviceAreas } = req.body;

    // Validate required fields
    if (!name || !phone || !password) {
      return res.status(400).json({ message: 'Name, phone and password are required' });
    }

    // Check if phone already exists
    const existing = await DeliveryBoy.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // Parse serviceAreas (handle both stringified array and direct array)
    let areasArray = [];
    try {
      areasArray = Array.isArray(serviceAreas) 
        ? serviceAreas 
        : JSON.parse(serviceAreas || '[]');
      
      if (!Array.isArray(areasArray)) {
        throw new Error('Invalid service areas format');
      }
    } catch (err) {
      return res.status(400).json({ 
        message: 'serviceAreas must be a valid array (e.g., ["Area1", "Area2"])',
        error: err.message
      });
    }

    // Handle image upload
    let profileImageUrl = null;
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer);
        profileImageUrl = result.secure_url;
      } catch (uploadErr) {
        console.error('Cloudinary upload failed:', uploadErr);
        return res.status(500).json({ 
          message: 'Profile image upload failed',
          error: uploadErr.message 
        });
      }
    }

    // Create delivery boy
    const deliveryBoy = await DeliveryBoy.create({
      name,
      phone,
      password,
      serviceAreas: areasArray,
      profileImage: profileImageUrl
    });

    // Return response without sensitive data
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        id: deliveryBoy._id,
        name: deliveryBoy.name,
        phone: deliveryBoy.phone,
        serviceAreas: deliveryBoy.serviceAreas,
        profileImage: deliveryBoy.profileImage
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Registration failed',
      error: err.message 
    });
  }
};

export const loginDeliveryBoy = async (req, res) => {
  try {
    const { phone, password } = req.body;
    console.log("login details",phone,password)
    const deliveryBoy = await DeliveryBoy.findOne({ phone });
    console.log("deliveryboi details",deliveryBoy)
    if (!deliveryBoy || !(await deliveryBoy.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid phone or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: deliveryBoy._id, role: 'deliveryBoy' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      deliveryBoy: {
        id: deliveryBoy._id,
        name: deliveryBoy.name,
        serviceAreas: deliveryBoy.serviceAreas,
        phone: deliveryBoy.phone,
        
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

export const getMyDeliveries = async (req, res) => {
  try {
    console.log("req.user value:", req.user);

    const deliveryBoyId = req.user.id || req.user._id;

    // 1. Find delivery boy and get service areas
    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
    if (!deliveryBoy) {
      return res.status(404).json({ message: "Delivery boy not found" });
    }

    const serviceAreas = deliveryBoy.serviceAreas;

    // 2. Get today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 3. Find today's deliveries in those areas
    const deliveriesRaw = await Delivery.find({
      'address.area': { $in: serviceAreas },
      deliveryDate: { $gte: startOfDay, $lte: endOfDay }
    })
      .sort({
        'address.area': 1,
        'address.street': 1,
        deliveryDate: 1
      })
      .lean();

    // 4. Get all unique userIds from deliveries
    const userIds = [...new Set(deliveriesRaw.map(d => d.user.toString()))];

    // 5. Fetch all subscriptions for these users and filter for active ones
    const allSubscriptions = await Subscription.find({
      user: { $in: userIds }
    }).lean();

    // Create a Map of user to their active subscription IDs
    const userActiveSubsMap = new Map();
    allSubscriptions.forEach(sub => {
      if (sub.status === 'active') {
        const userId = sub.user.toString();
        if (!userActiveSubsMap.has(userId)) {
          userActiveSubsMap.set(userId, []);
        }
        userActiveSubsMap.get(userId).push(sub._id.toString());
      }
    });

    // 6. Filter deliveries to only include those with active subscriptions
    const filteredDeliveries = deliveriesRaw.filter(delivery => {
      const userId = delivery.user.toString();
      const activeSubIds = userActiveSubsMap.get(userId) || [];
      // Check if delivery's subscription is in the active subscriptions list
      return activeSubIds.includes(delivery.subscription.toString());
    });

    // 7. Get user info only for users with active subscriptions
    const activeUserIds = [...new Set(filteredDeliveries.map(d => d.user.toString()))];
    const userInfos = await UserInfo.find({ 
      user: { $in: activeUserIds } 
    }).lean();

    // 8. Map userId to userInfo
    const userInfoMap = {};
    userInfos.forEach(info => {
      userInfoMap[info.user.toString()] = info;
    });

    // 9. Attach fullName and phone to each delivery
    const deliveries = filteredDeliveries.map(delivery => {
      const info = userInfoMap[delivery.user.toString()];
      return {
        ...delivery,
        userInfo: info ? {
          fullName: info.fullName,
          phone: info.phone,
          googleMapLink: info.address.googleMapLink,
        } : null
      };
    });

    console.log("Filtered deliveries with active subscriptions:", deliveries);
    
    // 10. Return enriched data
    res.status(200).json({
      message: "Today's deliveries fetched successfully",
      total: deliveries.length,
      deliveries
    });

  } catch (err) {
    console.error("Error in getMyDeliveries:", err);
    res.status(500).json({
      message: "Failed to fetch deliveries",
      error: err.message
    });
  }
};

export const getalldeliveriesinformation = async (req, res) => {
  try {

    // 1. Find delivery boy and get service areas
    const deliveryBoy = await DeliveryBoy.find()
    // 10. Return enriched data
    res.status(200).json(deliveryBoy)

  } catch (err) {
    console.error("Error in delveries bois information:", err);
    res.status(500).json({
      message: "Failed to fetch deliveries bois information",
      error: err.message
    });
  }
};

export const updateDeliveryBoyProfile = async (req, res) => {
  try {
    const deliveryBoyId = req.user.id; // From auth middleware
    const { name, phone, serviceAreas } = req.body;

    // 1. Find the delivery boy
    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
    if (!deliveryBoy) {
      return res.status(404).json({ success: false, message: 'Delivery boy not found' });
    }

    // 2. Handle phone number update (if changed)
    if (phone && phone !== deliveryBoy.phone) {
      const phoneExists = await DeliveryBoy.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({ success: false, message: 'Phone number already in use' });
      }
      deliveryBoy.phone = phone;
    }

    // 3. Handle service areas (array validation)
    if (serviceAreas) {
      try {
        const areasArray = Array.isArray(serviceAreas) 
          ? serviceAreas 
          : JSON.parse(serviceAreas);
        
        if (!Array.isArray(areasArray)) {
          throw new Error('Invalid format');
        }
        deliveryBoy.serviceAreas = areasArray;
      } catch (err) {
        return res.status(400).json({ 
          success: false,
          message: 'serviceAreas must be a valid array (e.g., ["Area1", "Area2"])'
        });
      }
    }

    // 4. Handle name update
    if (name) {
      deliveryBoy.name = name;
    }

    // 5. Handle profile image update
    if (req.file) {
      try {
        // Delete old image from Cloudinary if exists
        if (deliveryBoy.profileImage) {
          const publicId = deliveryBoy.profileImage.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`delivery_boys/${publicId}`);
        }

        // Upload new image
        const result = await uploadToCloudinary(req.file.buffer);
        deliveryBoy.profileImage = result.secure_url;
      } catch (uploadErr) {
        console.error('Image upload failed:', uploadErr);
        return res.status(500).json({ 
          success: false,
          message: 'Profile image update failed' 
        });
      }
    }

    // 6. Save updates
    await deliveryBoy.save();

    // 7. Return updated profile (without sensitive data)
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: deliveryBoy._id,
        name: deliveryBoy.name,
        phone: deliveryBoy.phone,
        serviceAreas: deliveryBoy.serviceAreas,
        profileImage: deliveryBoy.profileImage
      }
    });

  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Profile update failed',
      error: err.message 
    });
  }
};