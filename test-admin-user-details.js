import 'dotenv/config';
import { connect } from './src/db/connect.js';
import User from './src/modules/users/user.model.js';
import { env } from './src/config/env.js';

async function testAdminUserDetails() {
  try {
    await connect(env.MONGO_URI);
    console.log('🔍 Testing admin user details endpoint...');
    
    // Get a test user to check
    const user = await User.findOne().lean();
    if (!user) {
      console.log('❌ No users found in database');
      process.exit(1);
    }
    
    console.log(`✅ Found test user: ${user.name} (${user.email})`);
    console.log(`📋 User ID: ${user._id}`);
    console.log('\n🔗 Test endpoint with:');
    console.log(`GET http://localhost:4000/api/admin/users/${user._id}`);
    console.log('\n🔑 Don\'t forget to include admin authentication header!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  
  process.exit(0);
}

testAdminUserDetails();
