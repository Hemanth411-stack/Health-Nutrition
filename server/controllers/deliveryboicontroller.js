import jwt from 'jsonwebtoken';
import DeliveryBoy from "../models/deliveryboi.js"
import Delivery from '../models/Delivery.js';
import UserInfo from '../models/Userinformation.js';

export const registerDeliveryBoy = async (req, res) => {
  try {
    const { name, phone, password, serviceAreas } = req.body;

    const existing = await DeliveryBoy.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    const deliveryBoy = await DeliveryBoy.create({
      name,
      phone,
      password,
      serviceAreas
    });

    res.status(201).json({
      message: 'Registered successfully',
      deliveryBoy: {
        id: deliveryBoy._id,
        name: deliveryBoy.name,
        phone: deliveryBoy.phone,
        serviceAreas: deliveryBoy.serviceAreas
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
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
        serviceAreas: deliveryBoy.serviceAreas
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
      .lean(); // return plain JS objects

    // 4. Get all userIds
    const userIds = deliveriesRaw.map(d => d.user);

    // 5. Fetch user info data
    const userInfos = await UserInfo.find({ user: { $in: userIds } }).lean();

    // 6. Map userId to userInfo
    const userInfoMap = {};
    userInfos.forEach(info => {
      userInfoMap[info.user.toString()] = info;
    });

    // 7. Attach fullName and phone to each delivery
    const deliveries = deliveriesRaw.map(delivery => {
      const info = userInfoMap[delivery.user.toString()];
      return {
        ...delivery,
        userInfo: info ? {
          fullName: info.fullName,
          phone: info.phone
        } : null
      };
    });

    // 8. Return enriched data
    res.status(200).json({
      message: "Today's deliveries fetched successfully",
      total: deliveries.length,
      deliveries
    });

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch deliveries",
      error: err.message
    });
  }
};