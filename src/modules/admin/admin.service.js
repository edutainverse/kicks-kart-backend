import User from '../users/user.model.js';
import Order from '../orders/order.model.js';
import Product from '../products/product.model.js';
import Inventory from '../inventory/inventory.model.js';
import Cart from '../cart/cart.model.js';

export async function stats() {
  const [users, orders, revenueAgg, lowStock] = await Promise.all([
    User.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    Inventory.aggregate([{ $unwind: '$variants' }, { $match: { 'variants.stock': { $lt: 5 } } }, { $count: 'low' }]),
  ]);
  const revenue = revenueAgg?.[0]?.total || 0;
  const low = lowStock?.[0]?.low || 0;
  return { users, orders, revenue, lowStock: low };
}

export async function listUsers(query) {
  const q = query?.query ? { $or: [ { email: { $regex: query.query, $options: 'i' } }, { name: { $regex: query.query, $options: 'i' } } ] } : {};
  return User.find(q).lean();
}

export async function patchUser(id, data) {
  return User.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function getUserDetails(id) {
  // Get user details
  const user = await User.findById(id).lean();
  if (!user) throw new Error('User not found');

  // Get user's orders with populated product details
  const orders = await Order.find({ userId: id })
    .populate({
      path: 'items.productId',
      model: 'Product',
      select: 'title description price mainImage images category brand stock'
    })
    .sort({ createdAt: -1 })
    .lean();

  // Get user's current cart with populated product details
  const cart = await Cart.findOne({ userId: id })
    .populate({
      path: 'items.productId',
      model: 'Product',
      select: 'title description price mainImage images category brand stock'
    })
    .lean();

  // Calculate user statistics
  const totalOrders = orders.length;
  const totalSpent = orders
    .filter(order => order.status === 'paid')
    .reduce((sum, order) => sum + (order.amount || 0), 0);
  
  const lastOrderDate = orders.length > 0 ? orders[0].createdAt : null;

  return {
    user,
    orders,
    cart: cart || { items: [], totals: { subtotal: 0 } },
    stats: {
      totalOrders,
      totalSpent,
      lastOrderDate,
      cartItemCount: cart?.items?.length || 0
    }
  };
}

export async function getUserOrders(id) {
  // Get user's orders with populated product details
  const orders = await Order.find({ userId: id })
    .populate({
      path: 'items.productId',
      model: 'Product',
      select: 'title description price mainImage images category brand stock'
    })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .lean();

  return orders;
}

export async function listOrders(query) {
  const q = {};
  if (query?.status) q.status = query.status;
  return Order.find(q)
    .populate({
      path: 'items.productId',
      model: 'Product',
      select: 'title description price mainImage images category brand stock'
    })
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .lean();
}

export async function getOrderById(id) {
  return Order.findById(id)
    .populate({
      path: 'items.productId',
      model: 'Product',
      select: 'title description price mainImage images category brand stock'
    })
    .populate('userId', 'name email')
    .lean();
}

export async function patchOrder(id, status) {
  return Order.findByIdAndUpdate(id, { status }, { new: true }).lean();
}

export async function listProducts() { return Product.find().lean(); }
