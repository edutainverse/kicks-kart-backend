import { loadEnv, env } from '../config/env.js';
import { connect } from '../db/connect.js';
import User from '../modules/users/user.model.js';
import Product from '../modules/products/product.model.js';
import Inventory from '../modules/inventory/inventory.model.js';
import Order from '../modules/orders/order.model.js';
import PaymentIntent from '../modules/payments/paymentIntent.model.js';
import { createPaymentIntent, processOutcome } from '../modules/payments/payments.service.js';

function pick(arr, n) {
  const copy = arr.slice();
  const out = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

async function main() {
  loadEnv();
  await connect(env.MONGO_URI);

  const users = await User.find({ role: 'user' }).lean();
  const products = await Product.find({ active: true }).lean();
  const invMap = new Map();
  const invs = await Inventory.find({ productId: { $in: products.map((p) => p._id) } }).lean();
  for (const inv of invs) invMap.set(inv.productId.toString(), inv.variants);

  let created = 0;
  for (const user of users.slice(0, Math.min(users.length, 20))) {
    const ordersForUser = Math.floor(Math.random() * 3) + 1; // 1-3 orders per user
    for (let i = 0; i < ordersForUser; i++) {
      const chosen = pick(products, Math.floor(Math.random() * 3) + 1);
      const items = chosen.map((p) => {
        const variants = invMap.get(p._id.toString()) || [];
        const size = (variants[0]?.size) || (p.sizes?.[0]) || '9';
        const qty = Math.floor(Math.random() * 2) + 1; // 1-2
        return { productId: p._id, size, qty, price: p.price };
      });
      const amount = items.reduce((s, it) => s + it.price * it.qty, 0);
      const order = await Order.create({ userId: user._id, items, amount, status: 'pending', shippingAddress: user.address || {} });
      const pi = await createPaymentIntent({ orderId: order._id.toString(), amount });
      order.paymentIntentId = pi._id.toString();
      await order.save();

      // Randomly mark paid (~70%) by processing outcome
      if (Math.random() < 0.7) {
        await processOutcome({ paymentIntentId: pi._id.toString(), outcome: 'succeeded' });
      }
      created++;
    }
  }

  // eslint-disable-next-line no-console
  console.log('Seeded orders:', created);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
