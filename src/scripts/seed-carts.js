import { loadEnv, env } from '../config/env.js';
import { connect } from '../db/connect.js';
import User from '../modules/users/user.model.js';
import Product from '../modules/products/product.model.js';
import Cart from '../modules/cart/cart.model.js';

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

async function main() {
  loadEnv();
  await connect(env.MONGO_URI);

  const users = await User.find({ role: 'user' }).lean();
  const products = await Product.find({ active: true }).lean();
  if (!users.length || !products.length) {
    console.log('No users or products to seed carts.');
    process.exit(0);
  }

  const sizes = ['6','7','8','9','10'];
  let count = 0;

  for (const u of users) {
    const items = [];
    const n = 1 + Math.floor(Math.random() * 3); // 1..3 items
    const used = new Set();
    for (let i = 0; i < n; i++) {
      const p = pick(products);
      if (used.has(p._id.toString())) continue;
      used.add(p._id.toString());
      items.push({ productId: p._id, size: pick(sizes), qty: 1 + Math.floor(Math.random() * 2), priceAtAdd: p.price });
    }
    await Cart.updateOne(
      { userId: u._id },
      { $set: { items, totals: { subtotal: items.reduce((s, it) => s + it.qty * it.priceAtAdd, 0) } } },
      { upsert: true }
    );
    count++;
  }

  console.log(`Seeded carts for ${count} users`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
