import mongoose from 'mongoose';

const VariantSchema = new mongoose.Schema(
  {
    size: { type: String, required: true },
    stock: { type: Number, required: true },
  },
  { _id: false }
);

const InventorySchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, unique: true },
    variants: [VariantSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Inventory', InventorySchema);
