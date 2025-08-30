// GET /api/dashboard/orders-trend
export async function getOrdersTrend(req, res, next) {
  try {
    // Orders per day for last 7 days
    const days = 7;
    const start = new Date();
    start.setHours(0,0,0,0);
    start.setDate(start.getDate() - days + 1);
    const trend = await Order.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      } },
      { $sort: { _id: 1 } }
    ]);
    res.json({ trend });
  } catch (e) { next(e); }
}
import Order from '../orders/order.model.js';
import User from '../users/user.model.js';
import Product from '../products/product.model.js';
import Inventory from '../inventory/inventory.model.js';

// GET /api/dashboard/stats
export async function getStats(req, res, next) {
  try {
    const [orders24h, revenue, lowStock, totalUsers] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Inventory.countDocuments({ 'variants.stock': { $lte: 5 } }),
      User.countDocuments()
    ]);
    res.json({
      orders24h,
      revenue: revenue[0]?.total || 0,
      lowStockItems: lowStock,
      totalUsers
    });
  } catch (e) { next(e); }
}

// GET /api/dashboard/recent-activity
export async function getRecentActivity(req, res, next) {
  try {
    // Recent orders
    const orders = await Order.find().sort({ createdAt: -1 }).limit(5).lean();
    // Recent products
    const products = await Product.find().sort({ updatedAt: -1 }).limit(5).lean();
    // Recent users
    const users = await User.find().sort({ createdAt: -1 }).limit(5).lean();
    // Low stock alerts
    const lowStock = await Inventory.find({ 'variants.stock': { $lte: 5 } }).limit(5).lean();
    res.json({
      orders,
      products,
      users,
      lowStock
    });
  } catch (e) { next(e); }
}
