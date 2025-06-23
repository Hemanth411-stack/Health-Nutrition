import mongoose from 'mongoose';

const userInfoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // One profile per user
  },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },

  slot:{
    type:String,
    default : "morning 6Am - 8Am"
  },

  address: {
    street: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  }
}, { timestamps: true });

export default mongoose.model('UserInfo', userInfoSchema);
