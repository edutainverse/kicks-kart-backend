import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    size: { type: String, required: true },
    qty: { type: Number, required: true },
    priceAtAdd: { type: Number, required: true },
  },
  { timestamps: true }
);

const CartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [CartItemSchema],
    totals: {
      subtotal: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Cart', CartSchema);
