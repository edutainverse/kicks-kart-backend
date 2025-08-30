import 'dotenv/config';
import { connect } from './src/db/connect.js';
import Product from './src/modules/products/product.model.js';
import { env } from './src/config/env.js';

async function checkAndUpdateSizes() {
  try {
    await connect(env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check a few products to see their current size data
    const sampleProducts = await Product.find({}).limit(5).lean();
    
    console.log('\n📊 Sample products and their sizes:');
    sampleProducts.forEach(product => {
      console.log(`- ${product.title}: sizes = ${JSON.stringify(product.sizes || [])}`);
    });

    // Count products without sizes
    const productsWithoutSizes = await Product.countDocuments({ 
      $or: [
        { sizes: { $exists: false } },
        { sizes: { $size: 0 } },
        { sizes: null }
      ]
    });

    console.log(`\n🔍 Products without sizes: ${productsWithoutSizes}`);

    if (productsWithoutSizes > 0) {
      console.log('\n🔧 Adding standard shoe sizes to products without sizes...');
      
      // Standard shoe sizes for different categories
      const shoeSizes = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11'];
      
      const updateResult = await Product.updateMany(
        { 
          $or: [
            { sizes: { $exists: false } },
            { sizes: { $size: 0 } },
            { sizes: null }
          ]
        },
        { $set: { sizes: shoeSizes } }
      );

      console.log(`✅ Updated ${updateResult.modifiedCount} products with standard sizes`);
    }

    // Show final status
    const finalSample = await Product.findOne({ title: 'Jordan Sneakers' }).lean();
    if (finalSample) {
      console.log(`\n📋 Sample product (${finalSample.title}) sizes: ${JSON.stringify(finalSample.sizes)}`);
    }

    console.log('\n🎉 Size check and update complete!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkAndUpdateSizes();
