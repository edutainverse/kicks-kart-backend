import Order from './order.model.js';

export async function listMy(userId) {
  return Order.find({ userId }).sort({ createdAt: -1 }).lean();
}

export async function getByIdUser(userId, id) {
  const o = await Order.findOne({ _id: id, userId }).lean();
  return o;
}

export async function updateStatus(id, status) {
  return Order.findByIdAndUpdate(id, { status }, { new: true }).lean();
}
