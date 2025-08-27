import Cart from './cart.model.js';
import Product from '../products/product.model.js';
import Order from '../orders/order.model.js';
import { createPaymentIntent } from '../payments/payments.service.js';

function computeTotals(cart) {
  const subtotal = cart.items.reduce((sum, it) => sum + it.qty * it.priceAtAdd, 0);
  cart.totals = { subtotal };
  return cart;
}

export async function getCart(userId) {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [], totals: { subtotal: 0 } });
  return cart;
}

export async function addItem(userId, { productId, size, qty }) {
  const product = await Product.findById(productId).lean();
  if (!product) throw Object.assign(new Error('Product not found'), { status: 404, code: 'NOT_FOUND' });
  let cart = await getCart(userId);
  cart.items.push({ productId, size, qty, priceAtAdd: product.price });
  computeTotals(cart);
  await cart.save();
  return cart;
}

export async function updateItem(userId, itemId, { qty }) {
  const cart = await getCart(userId);
  const item = cart.items.id(itemId);
  if (!item) throw Object.assign(new Error('Item not found'), { status: 404, code: 'NOT_FOUND' });
  item.qty = qty;
  computeTotals(cart);
  await cart.save();
  return cart;
}

export async function removeItem(userId, itemId) {
  const cart = await getCart(userId);
  const item = cart.items.id(itemId);
  if (!item) return cart;
  item.deleteOne();
  computeTotals(cart);
  await cart.save();
  return cart;
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
  return { orderId: order._id.toString(), clientSecret: intent.clientSecret };
}

export async function clearCart(userId) {
  await Cart.updateOne({ userId }, { $set: { items: [], totals: { subtotal: 0 } } });
}
