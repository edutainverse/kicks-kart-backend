import mongoose from 'mongoose';

const emailTrackingSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  emailType: { type: String, required: true }, // welcome, forgot-password, order-placed, order-shipped, payment-success
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String, required: true },
  sentAt: { type: Date, default: Date.now },
  openedAt: { type: Date },
  opened: { type: Boolean, default: false },
  userAgent: String,
  ipAddress: String,
  metadata: { type: Map, of: String } // Additional data like orderId, etc.
}, {
  timestamps: true
});

export default mongoose.model('EmailTracking', emailTrackingSchema);
