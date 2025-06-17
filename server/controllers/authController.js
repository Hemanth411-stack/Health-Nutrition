import mongoose from 'mongoose';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import Subscription from '../models/Subscription.js';
import Delivery from '../models/Delivery.js';
import Userinformation from '../models/Userinformation.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// 📌 Register
export const registerUser = async (req, res) => {
  const { name, phone, email, password,role } = req.body;
  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone already registered' });
    }

    const user = await User.create({ name, phone, email, password,role });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      token: generateToken(user._id),
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// 📌 Login
export const loginUser = async (req, res) => {
  const { phone, password,role } = req.body;
  try {
    const user = await User.findOne({ phone });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      phone: user.phone,
      token: generateToken(user._id),
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// 📌 Delete User (with cascade deletion)
export const deleteUser = async (req, res) => {
  const { userId } = req.body;
  
  try {
    // Start a transaction to ensure all deletions succeed or fail together
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Find the user first
      const user = await User.findById(userId).session(session);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // 2. Delete all subscriptions for this user
      await Subscription.deleteMany({ user: userId }).session(session);

      // 3. Delete all deliveries for this user
      await Delivery.deleteMany({ user: userId }).session(session);
      await Userinformation.deleteMany({ user: userId }).session(session);
      // 4. Finally, delete the user
      await User.findByIdAndDelete(userId).session(session);

      // Commit the transaction if all operations succeeded
      await session.commitTransaction();
      
      res.json({ message: 'User and all associated data deleted successfully' });
    } catch (error) {
      // If any error occurs, abort the transaction
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to delete user and associated data', 
      error: err.message 
    });
  }
};