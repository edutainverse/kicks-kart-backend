import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  addresses: [{
    line1: String,
    line2: String,
    city: String,
    state: String,
    zip: String,
    country: String,
    label: String,
    isDefault: { type: Boolean, default: false }
  }]
});

export default mongoose.model('Address', addressSchema);
