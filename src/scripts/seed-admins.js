import { loadEnv, env } from '../config/env.js';
import { connect } from '../db/connect.js';
import User from '../modules/users/user.model.js';
import { hashPassword } from '../utils/crypto.js';

const admins = [
  { email: 'slikeqa@gmail.com', name: 'Slike QA', password: 'admin123' },
  { email: 'admin@edutainverse.com', name: 'Edutainverse Admin', password: 'admin123' },
  { email: 'admin@kickskart.com', name: 'KicksKart Admin', password: 'admin123' },
];

// Regular test user
const testUser = { email: 'user@kickskart.local', name: 'Test User', password: 'User@123', role: 'user' };

async function main() {
  loadEnv();
  await connect(env.MONGO_URI);

  console.log('Starting admin and user seeding...');

  // Clear existing users
  await User.deleteMany({});

  // Create admin users
  for (const admin of admins) {
    const passwordHash = await hashPassword(admin.password);
    const user = await User.create({
      name: admin.name,
      email: admin.email,
      role: 'admin',
      passwordHash
    });
    console.log(`✅ Created admin: ${user.email} (password: ${admin.password})`);
  }

  // Create test user
  const userPasswordHash = await hashPassword(testUser.password);
  const user = await User.create({
    name: testUser.name,
    email: testUser.email,
    role: testUser.role,
    passwordHash: userPasswordHash
  });
  console.log(`✅ Created user: ${user.email} (password: ${testUser.password})`);

  console.log('\n🎉 Admin and user seeding completed!');
  console.log(`Total admins created: ${admins.length}`);
  console.log(`Total users created: 1`);
  
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
