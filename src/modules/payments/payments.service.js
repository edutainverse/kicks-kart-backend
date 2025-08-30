import crypto from 'crypto';
import PaymentIntent from './paymentIntent.model.js';
import Order from '../orders/order.model.js';
import { verifySignature } from '../../utils/hmac.js';
import { env } from '../../config/env.js';
import { decrementStock } from '../inventory/inventory.service.js';
import { clearCart } from '../cart/cart.service.js';
import User from '../users/user.model.js';
import { sendMail } from '../../utils/mailer.js';
import { paymentSuccessEmailTemplate } from '../../utils/emailTemplates.js';

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
  let pi = null;
  try {
    pi = await PaymentIntent.findById(paymentIntentId);
  } catch (e) {
    // ignore invalid ObjectId errors
  }
  if (!pi) {
    // Always return success for fakepay
    return { received: true, fake: true };
  }
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
      // Send payment success email
      try {
        const user = await User.findById(order.userId).lean();
        if (user && user.email) {
          const { html, trackingId } = paymentSuccessEmailTemplate(user.name, order._id, order.amount);
          await sendMail({
            to: user.email,
            subject: 'Payment Successful - KicksKart',
            html,
            trackingId,
            emailType: 'payment-success',
            userId: user._id,
            metadata: { orderId: order._id.toString(), amount: order.amount.toString() }
          });
        }
      } catch (e) {
        console.error('Failed to send payment success email:', e);
      }
    }
  } else if (outcome === 'failed') {
    pi.status = 'failed';
    pi.processed = true;
    await pi.save();
  }
  return { received: true };
}
