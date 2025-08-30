import Cart from './cart.model.js';
import Product from '../products/product.model.js';
import Order from '../orders/order.model.js';
import { createPaymentIntent } from '../payments/payments.service.js';
import User from '../users/user.model.js';
import { sendMail } from '../../utils/mailer.js';
import { orderPlacedEmailTemplate } from '../../utils/emailTemplates.js';

function computeTotals(cart) {
  const subtotal = cart.items.reduce((sum, it) => sum + it.qty * it.priceAtAdd, 0);
  cart.totals = { subtotal };
  return cart;
}

export async function getCart(userId) {
  let cart = await Cart.findOne({ userId }).populate({
    path: 'items.productId',
    select: 'title brand price images mainImage category active'
  });
  if (!cart) cart = await Cart.create({ userId, items: [], totals: { subtotal: 0 } });
  return cart;
}

export async function addItem(userId, { productId, size, qty }) {
  const product = await Product.findById(productId).lean();
  if (!product) throw Object.assign(new Error('Product not found'), { status: 404, code: 'NOT_FOUND' });
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [], totals: { subtotal: 0 } });
  cart.items.push({ productId, size, qty, priceAtAdd: product.price });
  computeTotals(cart);
  await cart.save();
  
  // Return cart with populated product details
  cart = await Cart.findOne({ userId }).populate({
    path: 'items.productId',
    select: 'title brand price images mainImage category active'
  });
  return cart;
}

export async function updateItem(userId, itemId, { qty }) {
  const cart = await Cart.findOne({ userId });
  if (!cart) throw Object.assign(new Error('Cart not found'), { status: 404, code: 'NOT_FOUND' });
  const item = cart.items.id(itemId);
  if (!item) throw Object.assign(new Error('Item not found'), { status: 404, code: 'NOT_FOUND' });
  item.qty = qty;
  computeTotals(cart);
  await cart.save();
  
  // Return cart with populated product details
  const populatedCart = await Cart.findOne({ userId }).populate({
    path: 'items.productId',
    select: 'title brand price images mainImage category active'
  });
  return populatedCart;
}

export async function removeItem(userId, itemId) {
  const cart = await Cart.findOne({ userId });
  if (!cart) return await Cart.create({ userId, items: [], totals: { subtotal: 0 } });
  const item = cart.items.id(itemId);
  if (!item) return cart;
  item.deleteOne();
  computeTotals(cart);
  await cart.save();
  
  // Return cart with populated product details
  const populatedCart = await Cart.findOne({ userId }).populate({
    path: 'items.productId',
    select: 'title brand price images mainImage category active'
  });
  return populatedCart;
}

export async function checkout(user, shippingAddress) {
  const cart = await getCart(user.sub);
  if (!cart.items.length) throw Object.assign(new Error('Cart is empty'), { status: 400, code: 'VALIDATION_ERROR' });
  computeTotals(cart);
  const order = await Order.create({
    userId: user.sub,
    items: cart.items.map((it) => ({ productId: it.productId, size: it.size, qty: it.qty, price: it.priceAtAdd })),
    amount: cart.totals.subtotal,
    status: 'pending',
    shippingAddress: shippingAddress || {},
  });
  const intent = await createPaymentIntent({ orderId: order._id.toString(), amount: order.amount });
  order.paymentIntentId = intent._id;
  await order.save();

  // Send order confirmation email
  try {
    const userData = await User.findById(user.sub).lean();
    if (userData && userData.email) {
      const { html, trackingId } = orderPlacedEmailTemplate(userData.name, order._id, order.items, order.amount);
      await sendMail({
        to: userData.email,
        subject: 'Order Placed - KicksKart',
        html,
        trackingId,
        emailType: 'order-placed',
        userId: userData._id,
        metadata: { orderId: order._id.toString(), amount: order.amount.toString() }
      });
    }
  } catch (e) {
    console.error('Failed to send order confirmation email:', e);
  }

  return { orderId: order._id.toString(), clientSecret: intent.clientSecret };
}

export async function clearCart(userId) {
  await Cart.updateOne({ userId }, { $set: { items: [], totals: { subtotal: 0 } } });
}
