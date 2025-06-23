import mongoose from 'mongoose';

const verifydeliverySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    address: {
      street: { type: String, required: true },
      area:   { type: String, required: true },
      city:   { type: String, required: true },
      state:  { type: String, required: true },
      pincode:{ type: String, required: true },
    },

    verifydeliverystatus: {
      type: String,
      enum: ['pending', 'approved', 'not-deliverable'],
      default: 'pending',
    },

    // ⬇️ new field
    deliveryCharge: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('VerifyDelivery', verifydeliverySchema);
