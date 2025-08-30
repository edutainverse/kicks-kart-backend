import 'dotenv/config';
import { connect } from './src/db/connect.js';
import Product from './src/modules/products/product.model.js';
import { env } from './src/config/env.js';

async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    await connect(env.MONGO_URI);
    console.log('Connected successfully!');
    
    const count = await Product.countDocuments();
    console.log(`Found ${count} products in database`);
    
    // Update one product as a test
    const product = await Product.findOne();
    if (product) {
      console.log(`Testing with product: ${product.title}`);
      await Product.findByIdAndUpdate(product._id, {
        mainImage: '/api/images/shoes/running_1.png',
        images: ['/api/images/shoes/running_1.png', '/api/images/shoes/running_2.png']
      });
      console.log('Test update successful!');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

testConnection();
