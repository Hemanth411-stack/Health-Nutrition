import UserInfo from '../models/Userinformation.js';

// 📌 Create or Update User Info
export const upsertUserInfo = async (req, res) => {
  try {
    const { fullName, phone, email, address, slot } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!fullName || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: 'Full name, phone, and address are required fields'
      });
    }

    // Validate address structure
    if (!address.street || !address.area || !address.city || !address.state || !address.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Address must include street, area, city, state, and pincode'
      });
    }

    // Prepare the update data
    const updateData = {
      fullName,
      phone,
      email: email || undefined, // Only include if provided
      slot: slot || 'morning 6AM - 8AM', // Default if not provided
      address: {
        street: address.street,
        area: address.area,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        googleMapLink: address.googleMapLink || undefined // Only include if provided
      }
    };

    // Upsert the user info
    const userInfo = await UserInfo.findOneAndUpdate(
      { user: userId },
      updateData,
      { 
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
        runValidators: true // Ensure schema validations run
      }
    );

    res.status(200).json({
      success: true,
      message: 'User information saved successfully',
      data: userInfo
    });

  } catch (error) {
    console.error('Error saving user info:', error);
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to save user information',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
// AIzaSyD4ENI4hJWADr-MD8dcCyCUGh1HP4nAy28
// API key 1
// AIzaSyAMPrwC9ii-4QvIRA_75CbxSp-6keDC6aM
// 📌 Get Current User Info
export const getUserInfo = async (req, res) => {
  try {
    const userInfo = await UserInfo.findOne({ user: req.user.id });

    if (!userInfo) {
      return res.status(404).json({ message: 'User information not found' });
    }

    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user info', error: error.message });
  }
};
