import mongoose from 'mongoose';
import Cart from './src/modules/cart/cart.model.js';
import './src/db/connect.js';

async function testCartPopulation() {
  try {
    console.log('🔍 Testing cart population...');
    
    // Find a cart with items
    const cart = await Cart.findOne({ 'items.0': { $exists: true } }).populate({
      path: 'items.productId',
      select: 'title brand price images mainImage category active'
    });
    
    if (!cart) {
      console.log('❌ No cart found with items');
      return;
    }
    
    console.log('✅ Found cart with populated data:');
    console.log(`📦 Cart ID: ${cart._id}`);
    console.log(`👤 User ID: ${cart.userId}`);
    console.log(`📝 Items count: ${cart.items.length}`);
    console.log('');
    
    cart.items.forEach((item, index) => {
      console.log(`🛍️  Item ${index + 1}:`);
      console.log(`   Product ID: ${item.productId._id}`);
      console.log(`   Title: ${item.productId.title}`);
      console.log(`   Brand: ${item.productId.brand}`);
      console.log(`   Price: ₹${item.productId.price}`);
      console.log(`   Size: ${item.size}`);
      console.log(`   Quantity: ${item.qty}`);
      console.log(`   Price at Add: ₹${item.priceAtAdd}`);
      console.log('');
    });
    
    console.log(`💰 Total: ₹${cart.totals.subtotal}`);
    
  } catch (error) {
    console.error('❌ Error testing cart population:', error);
  } finally {
    mongoose.connection.close();
  }
}

testCartPopulation();
