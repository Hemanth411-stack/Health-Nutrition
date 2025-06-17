import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  subscription: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Subscription',
  required: true
  },

  address: {
    street: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },

  slot: {
    type: String,
    enum: ['morning', 'evening'],
    default: 'morning'
  },

  deliveryDate: {
    type: Date,
    required: true
  },

  status: {
    type: String,
    enum: ['pending', 'delivered', 'missed'],
    default: 'pending'
  },

  isFestivalOrSunday: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('Delivery', deliverySchema);
