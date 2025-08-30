import { loadEnv, env } from '../config/env.js';
import { connect } from '../db/connect.js';
import Product from '../modules/products/product.model.js';
import Inventory from '../modules/inventory/inventory.model.js';

async function main() {
  loadEnv();
  await connect(env.MONGO_URI);

  // Clear existing product data
  await Product.deleteMany({});
  await Inventory.deleteMany({});

  console.log('Cleared existing product data. Starting product seeding...');

  const sizes = ['6','7','8','9','10','11','12'];
  const categories = ['sneakers','running','casual','formal','kids']; // Valid categories only
  const brands = ['Nike', 'Adidas', 'Puma', 'Reebok', 'Converse', 'Vans', 'New Balance', 'Under Armour', 'ASICS', 'Jordan'];
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Gray', 'Brown', 'Navy', 'Yellow', 'Orange'];
  const materials = ['Leather', 'Canvas', 'Mesh', 'Suede', 'Synthetic'];
  
  const prods = [];
  for (let i = 1; i <= 200; i++) {
    const brand = brands[i % brands.length];
    const category = categories[i % categories.length];
    const color = colors[i % colors.length];
    const material = materials[i % materials.length];
    
    const p = await Product.create({ 
      slug: `shoe-${i}`, 
      title: `${brand} ${color} ${category.charAt(0).toUpperCase() + category.slice(1)} Shoe ${i}`, 
      description: `Premium ${material.toLowerCase()} ${category} shoe with excellent comfort and style. Perfect for daily wear and sport activities.`, 
      brand: brand, 
      price: Math.floor(Math.random() * 300) + 50, // Random price between ₹50-₹349
      images: [], 
      sizes, 
      category: category, 
      active: true 
    });
    
    const variants = sizes.map((s) => ({ size: s, stock: Math.floor(Math.random() * 20) + 5 })); // Random stock 5-24
    await Inventory.create({ productId: p._id, variants });
    prods.push(p);
    
    // Log progress every 50 products
    if (i % 50 === 0) {
      console.log(`Created ${i} products...`);
    }
  }

  // eslint-disable-next-line no-console
  console.log('Product seeding completed:', { products: prods.length });
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
