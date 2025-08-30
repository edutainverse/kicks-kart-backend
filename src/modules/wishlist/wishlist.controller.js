import Wishlist from './wishlist.model.js';

export async function getWishlist(req, res, next) {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.sub }).lean();
    if (!wishlist) wishlist = await Wishlist.create({ userId: req.user.sub, items: [] });
    res.json(wishlist.items);
  } catch (e) { next(e); }
}

export async function addToWishlist(req, res, next) {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user.sub });
    if (!wishlist) wishlist = await Wishlist.create({ userId: req.user.sub, items: [] });
    if (!wishlist.items.some(i => i.productId.toString() === productId)) {
      wishlist.items.push({ productId });
      await wishlist.save();
    }
    res.status(201).json(wishlist.items);
  } catch (e) { next(e); }
}

export async function removeFromWishlist(req, res, next) {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user.sub });
    if (wishlist) {
      wishlist.items = wishlist.items.filter(i => i.productId.toString() !== productId);
      await wishlist.save();
    }
    res.json(wishlist.items);
  } catch (e) { next(e); }
}
