import 'dotenv/config';
import { connect } from './src/db/connect.js';
import Order from './src/modules/orders/order.model.js';
import User from './src/modules/users/user.model.js';
import Product from './src/modules/products/product.model.js'; // Added missing import
import { env } from './src/config/env.js';

async function checkAdminOrders() {
  try {
    await connect(env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check total orders count
    const totalOrders = await Order.countDocuments();
    console.log(`📊 Total orders in database: ${totalOrders}`);

    if (totalOrders > 0) {
      // Get sample orders
      const sampleOrders = await Order.find({})
        .populate({
          path: 'items.productId',
          model: 'Product',
          select: 'title description price mainImage images category brand stock'
        })
        .populate('userId', 'name email')
        .limit(3)
        .lean();

      console.log('\n📋 Sample orders:');
      sampleOrders.forEach((order, index) => {
        console.log(`${index + 1}. Order ID: ${order._id}`);
        console.log(`   User: ${order.userId?.name || 'N/A'} (${order.userId?.email || 'N/A'})`);
        console.log(`   Status: ${order.status}`);
        console.log(`   Amount: ₹${order.amount}`);
        console.log(`   Items: ${order.items.length}`);
        order.items.forEach(item => {
          console.log(`     - ${item.productId?.title || 'Unknown Product'} (₹${item.price})`);
        });
        console.log('');
      });
    }

    // Check admin users
    const adminUsers = await User.find({ role: 'admin' }).lean();
    console.log(`👥 Admin users found: ${adminUsers.length}`);
    adminUsers.forEach(admin => {
      console.log(`   - ${admin.name} (${admin.email})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit(0);
  }
}

checkAdminOrders();
