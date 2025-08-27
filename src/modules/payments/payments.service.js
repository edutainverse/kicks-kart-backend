import crypto from 'crypto';
import PaymentIntent from './paymentIntent.model.js';
import Order from '../orders/order.model.js';
import { verifySignature } from '../../utils/hmac.js';
import { env } from '../../config/env.js';
import { decrementStock } from '../inventory/inventory.service.js';
import { clearCart } from '../cart/cart.service.js';

export async function createPaymentIntent({ orderId, amount }) {
  const clientSecret = crypto.randomBytes(16).toString('hex');
  const pi = await PaymentIntent.create({ orderId, amount, clientSecret });
  return pi;
}

export async function handleWebhook(rawBody, signatureHeader) {
  const ok = verifySignature(rawBody, signatureHeader, env.FAKEPAY_WEBHOOK_SECRET);
  if (!ok) throw Object.assign(new Error('Invalid signature'), { status: 400, code: 'VALIDATION_ERROR' });
}

export async function processOutcome({ paymentIntentId, outcome }) {
  const pi = await PaymentIntent.findById(paymentIntentId);
  if (!pi) throw Object.assign(new Error('PaymentIntent not found'), { status: 404, code: 'NOT_FOUND' });
  if (pi.processed) return { received: true, idempotent: true };

  if (outcome === 'succeeded') {
    pi.status = 'succeeded';
    pi.processed = true;
    await pi.save();
    const order = await Order.findById(pi.orderId);
    if (order) {
      order.status = 'paid';
      await order.save();
      await decrementStock(order.items);
      await clearCart(order.userId);
    }
  } else if (outcome === 'failed') {
    pi.status = 'failed';
    pi.processed = true;
    await pi.save();
  }
  return { received: true };
}
