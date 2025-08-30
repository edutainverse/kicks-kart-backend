import 'dotenv/config';
import { connect } from './src/db/connect.js';
import Product from './src/modules/products/product.model.js';
import { env } from './src/config/env.js';

async function testImageDisplay() {
  try {
    await connect(env.MONGO_URI);
    console.log('🔍 Testing product images...\n');

    // Get first 3 products to show image structure
    const products = await Product.find({}).limit(3).lean();

    products.forEach(product => {
      console.log(`📦 Product: ${product.title}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Main Image: ${product.mainImage || 'Not set'}`);
      console.log(`   Gallery: ${product.images?.length || 0} images`);
      if (product.images?.length > 0) {
        product.images.forEach((img, i) => {
          console.log(`     ${i + 1}. ${img}`);
        });
      }
      console.log('');
    });

    console.log('💡 Image URL structure:');
    console.log('   Frontend: http://localhost:5173/images/shoes/running_1.png');
    console.log('   API response: /images/shoes/running_1.png');
    console.log('');
    console.log('🚀 Run "npm run update:images" to update all products!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

testImageDisplay();
