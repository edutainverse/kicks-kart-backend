import { loadEnv, env } from '../config/env.js';
import { connect } from '../db/connect.js';
import User from '../modules/users/user.model.js';
import Product from '../modules/products/product.model.js';
import Inventory from '../modules/inventory/inventory.model.js';
import { hashPassword } from '../utils/crypto.js';

async function main() {
  loadEnv();
  await connect(env.MONGO_URI);

  await User.deleteMany({});
  await Product.deleteMany({});
  await Inventory.deleteMany({});

  const admin = await User.create({ name: 'Admin', email: 'admin@kickscart.local', role: 'admin', passwordHash: await hashPassword('Admin@123') });
  const user = await User.create({ name: 'User', email: 'user@kickscart.local', role: 'user', passwordHash: await hashPassword('User@123') });

  const sizes = ['6','7','8','9','10'];
  const prods = [];
  for (let i = 1; i <= 12; i++) {
    const p = await Product.create({ slug: `shoe-${i}`, title: `Shoe ${i}`, description: 'Comfortable shoe', brand: 'BrandX', price: 999 + i * 10, images: [], sizes, category: ['sneakers','running','casual','formal','kids'][i % 5], active: true });
    const variants = sizes.map((s) => ({ size: s, stock: 5 + (i % 3) }));
    await Inventory.create({ productId: p._id, variants });
    prods.push(p);
  }

  // eslint-disable-next-line no-console
  console.log('Seeded:', { admin: admin.email, user: user.email, products: prods.length });
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
