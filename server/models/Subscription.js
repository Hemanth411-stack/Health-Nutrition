import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
  addOnPrices: {
    useAndThrowBox: {
      type: Number,
      default: 400
    },
    eggs: {
      type: Number,
      default: 300
    },
    ragiJawa: {
      type: Number,
      default: 900
    }
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'PhonePe'],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'awaiting_approval'],
    default: 'pending',
  },
  paymentProof: {
    utr: { type: String },
  },
  
  status: {
    type: String,
    enum: ['active', 'pending', 'cancelled', 'completed'],
    default: 'pending',
  },
  adminMessage: {
  type: String,
  },
  notes: {
    type: String,
  },
  pausedDays: {
    type: Number,
    default: 0,
    min: 0,
    max: 6
  },
  pausedDeliveries: {
    type: [{
      originalDate: Date,
      rescheduledDate: Date
    }],
    default: [] // This ensures it's never undefined
  }
}, { timestamps: true });

subscriptionSchema.statics.updateExpiredSubscriptions = async function() {
  const now = new Date();
  
  // Find all active subscriptions that have ended
  const expiredSubscriptions = await this.find({
    status: 'active',
    endDate: { $lt: now }
  });

  // Update their status to completed
  await this.updateMany(
    { _id: { $in: expiredSubscriptions.map(s => s._id) } },
    { $set: { status: 'completed' } }
  );

  return expiredSubscriptions;
};

export default mongoose.model('Subscription', subscriptionSchema);