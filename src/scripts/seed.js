import { loadEnv, env } from '../config/env.js';
import { connect } from '../db/connect.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
  loadEnv();
  await connect(env.MONGO_URI);

  console.log('🌱 Starting complete database seeding...\n');

  const seedSteps = [
    { name: 'Admin Users', script: 'seed:admins', emoji: '👨‍💼' },
    { name: 'Regular Users', script: 'seed:users', emoji: '👥' },
    { name: 'Products', script: 'seed:products', emoji: '👟' },
    { name: 'Inventory', script: 'seed:inventory', emoji: '📦' },
    { name: 'Carts', script: 'seed:carts', emoji: '🛒' },
    { name: 'Orders', script: 'seed:orders', emoji: '📋' }
  ];

  let completedSteps = 0;

  try {
    for (const step of seedSteps) {
      console.log(`${step.emoji} Seeding ${step.name}...`);
      
      try {
        await execAsync(`npm run ${step.script}`);
        completedSteps++;
        console.log(`✅ ${step.name} seeded successfully\n`);
      } catch (error) {
        console.log(`⚠️  ${step.name} seeding skipped (script may not exist or failed)\n`);
        // Continue with other seeds even if one fails
      }
    }

    console.log('🎉 Complete database seeding finished!');
    console.log(`📊 Completed: ${completedSteps}/${seedSteps.length} seed operations`);
    
    if (completedSteps < seedSteps.length) {
      console.log('\n💡 Note: Some seed operations were skipped. Make sure all seed scripts exist and are working.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Master seeding failed:', error);
    process.exit(1);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
