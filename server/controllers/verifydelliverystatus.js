
import User from '../models/User.js';
import verifydelivery from '../models/verifydelivery.js';

// Create new delivery verification request
export const createDeliveryVerification = async (req, res) => {
  try {
    const { address } = req.body;
    const userId = req.user._id;

    // Validate required fields with more detailed error messages
    const requiredFields = ['street', 'area', 'city', 'state', 'pincode'];
    const missingFields = requiredFields.filter(field => !address[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: 'Missing required address fields',
        missingFields,
        receivedData: address
      });
    }

    // Validate pincode format (6 digits)
    if (!/^\d{6}$/.test(address.pincode)) {
      return res.status(400).json({ 
        message: 'Pincode must be 6 digits' 
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for existing pending verification
    const existingVerification = await verifydelivery.findOne({
      user: userId,
      verifydeliverystatus: 'pending'
    });

    if (existingVerification) {
      return res.status(400).json({ 
        message: 'You already have a pending delivery verification',
        existingVerificationId: existingVerification._id
      });
    }

    // Create new verification
    const newVerification = new verifydelivery({
      user: userId,
      address: {
        street: address.street,
        area: address.area,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        type: address.type || 'Home'  // Default to 'Home' if not provided
      },
      verifydeliverystatus: 'pending'
    });

    const savedVerification = await newVerification.save();

    // Return the complete verification data
    res.status(201).json({
      success: true,
      message: 'Delivery verification request created successfully',
      data: savedVerification
    });

  } catch (error) {
    console.error('Error in createDeliveryVerification:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error creating delivery verification',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// current user status
export const getMyVerificationStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const verification = await verifydelivery.find({ user: userId }) // Get most recent

    if (!verification) {
      return res.status(404).json({ 
        message: 'No delivery verification found for this user',
        status: 'not-requested'
      });
    }

    res.status(200).json({
      message: 'Delivery verification status retrieved',
      data: verification
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching verification status',
      error: error.message 
    });
  }
};

// Get all verification requests (admin dashboard)
export const getAllVerifications = async (req, res) => {
  try {
    const { status, userId } = req.query;
    let query = {};

    if (status) {
      query.verifydeliverystatus = status;
    }

    if (userId) {
      query.user = userId;
    }

    const verifications = await verifydelivery.find()
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      count: verifications.length,
      data: verifications
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching verification requests',
      error: error.message 
    });
  }
};

// admin dashboard
// PATCH /api/verifydelivery/update
export const updateVerificationStatus = async (req, res) => {
  try {
    const { verificationId, status, deliveryCharge } = req.body;

    /* ─────────── 1. Basic validation ─────────── */
    // 1‑a. Validate status (if present)
    if (status && !['approved', 'not-deliverable', 'pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // 1‑b. Validate deliveryCharge (if present)
    if (deliveryCharge !== undefined) {
      const parsedCharge = Number(deliveryCharge);
      if (Number.isNaN(parsedCharge) || parsedCharge < 0) {
        return res.status(400).json({ message: 'deliveryCharge must be a non‑negative number' });
      }
    }

    /* ─────────── 2. Build dynamic update object ─────────── */
    const updateObj = {};
    if (status) updateObj.verifydeliverystatus = status;
    if (deliveryCharge !== undefined) updateObj.deliveryCharge = deliveryCharge;

    // Nothing to update?
    if (Object.keys(updateObj).length === 0) {
      return res.status(400).json({ message: 'Nothing to update' });
    }

    /* ─────────── 3. Apply update ─────────── */
    const verification = await verifydelivery
      .findByIdAndUpdate(verificationId, updateObj, { new: true })
      .populate('user', 'name email phone');

    if (!verification) {
      return res.status(404).json({ message: 'Verification not found' });
    }

    /* ─────────── 4. Respond ─────────── */
    res.status(200).json({
      message: 'Verification record updated successfully',
      data: verification,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating verification record',
      error: error.message,
    });
  }
};


// Get verification by ID
// export const getVerificationById = async (req, res) => {
//   try {
//     const verification = await verifydelivery.findById(req.params.id)
//       .populate('user', 'name email phone');

//     if (!verification) {
//       return res.status(404).json({ message: 'Verification not found' });
//     }

//     res.status(200).json(verification);

//   } catch (error) {
//     res.status(500).json({ 
//       message: 'Error fetching verification details',
//       error: error.message 
//     });
//   }
// };

// Update verification status (admin only)


// Get verification status for current user
