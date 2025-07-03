import mongoose from 'mongoose';

const userInfoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },

  slot: {
    type: String,
    default: "morning 6AM - 8AM"
  },

  address: {
    street: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    googleMapLink: {  // New field for Google Maps location
      type: String,
      validate: {
        validator: function(v) {
          // Basic validation for Google Maps URL
          return /^(https?:\/\/)?(www\.)?google\.[a-z]+\/maps/.test(v);
        },
        message: props => `${props.value} is not a valid Google Maps link!`
      }
    }
  }
}, { timestamps: true });

export default mongoose.model('UserInfo', userInfoSchema);