import User from '../users/user.model.js';
import Order from '../orders/order.model.js';
import Product from '../products/product.model.js';
import Inventory from '../inventory/inventory.model.js';

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

export async function listOrders(query) {
  const q = {};
  if (query?.status) q.status = query.status;
  return Order.find(q).sort({ createdAt: -1 }).lean();
}

export async function patchOrder(id, status) {
  return Order.findByIdAndUpdate(id, { status }, { new: true }).lean();
}

export async function listProducts() { return Product.find().lean(); }
