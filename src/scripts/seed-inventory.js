import { loadEnv, env } from '../config/env.js';
import { connect } from '../db/connect.js';
import Product from '../modules/products/product.model.js';
import Inventory from '../modules/inventory/inventory.model.js';

function genVariants(sizes) {
  const s = sizes?.length ? sizes : ['6','7','8','9','10'];
  return s.map((size) => ({ size, stock: 5 + Math.floor(Math.random() * 11) }));
}

async function main() {
  loadEnv();
  await connect(env.MONGO_URI);
  const products = await Product.find().lean();
  for (const p of products) {
    await Inventory.findOneAndUpdate(
      { productId: p._id },
      { productId: p._id, variants: genVariants(p.sizes) },
      { upsert: true, new: true }
    );
  }
  // eslint-disable-next-line no-console
  console.log('Inventory ensured for products:', products.length);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
