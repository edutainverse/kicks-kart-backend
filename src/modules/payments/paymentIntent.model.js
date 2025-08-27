import mongoose from 'mongoose';

const PaymentIntentSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['requires_payment', 'succeeded', 'failed'], default: 'requires_payment' },
    clientSecret: { type: String, required: true },
    processed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('PaymentIntent', PaymentIntentSchema);
