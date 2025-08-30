import Wishlist from './wishlist.model.js';

export async function getWishlist(req, res, next) {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.user.sub })
      .populate({
        path: 'items.productId',
        model: 'Product',
        select: 'title description price mainImage images category brand stock'
      })
      .lean();
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: req.user.sub, items: [] });
      return res.json([]);
    }
    
    // Transform the response to match frontend expectations
    const wishlistItems = wishlist.items.map(item => ({
      _id: item._id,
      product: item.productId // This contains the populated product data
    }));
    
    res.json(wishlistItems);
  } catch (e) { next(e); }
}

export async function addToWishlist(req, res, next) {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user.sub });
    if (!wishlist) wishlist = await Wishlist.create({ userId: req.user.sub, items: [] });
    
    // Check if product already exists in wishlist
    if (!wishlist.items.some(i => i.productId.toString() === productId)) {
      wishlist.items.push({ productId });
      await wishlist.save();
    }
    
    // Return populated wishlist
    const populatedWishlist = await Wishlist.findOne({ userId: req.user.sub })
      .populate({
        path: 'items.productId',
        model: 'Product',
        select: 'title description price mainImage images category brand stock'
      })
      .lean();
    
    const wishlistItems = populatedWishlist.items.map(item => ({
      _id: item._id,
      product: item.productId
    }));
    
    res.status(201).json(wishlistItems);
  } catch (e) { next(e); }
}

export async function removeFromWishlist(req, res, next) {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ userId: req.user.sub });
    
    if (wishlist) {
      wishlist.items = wishlist.items.filter(i => i.productId.toString() !== productId);
      await wishlist.save();
      
      // Return populated wishlist
      const populatedWishlist = await Wishlist.findOne({ userId: req.user.sub })
        .populate({
          path: 'items.productId',
          model: 'Product',
          select: 'title description price mainImage images category brand stock'
        })
        .lean();
      
      const wishlistItems = populatedWishlist.items.map(item => ({
        _id: item._id,
        product: item.productId
      }));
      
      res.json(wishlistItems);
    } else {
      res.json([]);
    }
  } catch (e) { next(e); }
}
