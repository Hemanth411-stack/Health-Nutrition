import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Family Combo Pack"
  price: { type: Number, required: true }, // e.g., 2666
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'monthly' },
  
  description: { type: String },

  contents: {
    fruitsPerDay: { type: Number },
    includes: [{ type: String }], // e.g., ["Fresh Vegetables", "Organic Sprouts", ...]
  },

  addOns: [
    {
      name: { type: String },         // e.g., "Ragi Jawa"
      description: { type: String },  // e.g., "250ml daily"
      price: { type: Number },        // e.g., 900
    }
  ],

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
