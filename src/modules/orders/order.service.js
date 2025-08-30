export async function getLatestOrder(userId) {
  return Order.findOne({ userId })
    .populate({
      path: 'items.productId',
      model: 'Product',
      select: 'title description price mainImage images category brand stock'
    })
    .sort({ createdAt: -1 })
    .lean();
}
import Order from './order.model.js';

import User from '../users/user.model.js';
import { sendMail } from '../../utils/mailer.js';

export async function listMy(userId) {
  return Order.find({ userId })
    .populate({
      path: 'items.productId',
      model: 'Product',
      select: 'title description price mainImage images category brand stock'
    })
    .sort({ createdAt: -1 })
    .lean();
}

export async function getByIdUser(userId, id) {
  const o = await Order.findOne({ _id: id, userId })
    .populate({
      path: 'items.productId',
      model: 'Product',
      select: 'title description price mainImage images category brand stock'
    })
    .lean();
  return o;
}

export async function updateStatus(id, status) {
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true }).lean();
  if (order && status === 'paid') {
    // Send email to user on payment success
    const user = await User.findById(order.userId).lean();
    if (user && user.email) {
      await sendMail({
        to: user.email,
        subject: 'Your order has been paid',
        text: `Hi ${user.name || ''},\nYour order #${order._id} has been paid successfully!`,
        html: `<p>Hi ${user.name || ''},</p><p>Your order <b>#${order._id}</b> has been paid successfully!</p>`
      });
    }
  }
  return order;
}
