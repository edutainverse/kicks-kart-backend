import mongoose from 'mongoose';

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{ productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' } }]
});

export default mongoose.model('Wishlist', wishlistSchema);
