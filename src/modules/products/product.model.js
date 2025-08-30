import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    brand: { type: String },
    price: { type: Number, required: true },
    mainImage: { type: String }, // Primary product image
    images: [{ type: String }],  // Gallery images (includes mainImage as first)
    sizes: [{ type: String }],
    category: {
      type: String,
      enum: ['sneakers', 'running', 'casual', 'formal', 'kids'],
      required: true,
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// text index for search
ProductSchema.index({ title: 'text', description: 'text', brand: 'text' });

export default mongoose.model('Product', ProductSchema);
