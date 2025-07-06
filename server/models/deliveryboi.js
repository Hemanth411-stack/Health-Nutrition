import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const deliveryBoySchema = new mongoose.Schema({
  name: { type: String, required: true },

  phone: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  serviceAreas: {
    type: [String], 
    default: []
  },
  profileImage: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
deliveryBoySchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password verification method
deliveryBoySchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('DeliveryBoy', deliveryBoySchema);
