import { loadEnv, env } from '../config/env.js';
import { connect } from '../db/connect.js';
import User from '../modules/users/user.model.js';
import { hashPassword } from '../utils/crypto.js';

const admins = [
  'slikeqa@gmail.com',
  'nvnjwl@gmail.com',
  'admin@edutainverse.com',
  'admin@kickskart.com',
  'admin@kickscart.local',
];

async function main() {
  loadEnv();
  await connect(env.MONGO_URI);
  const passwordHash = await hashPassword('admin123');
  for (const email of admins) {
    const update = { name: email.split('@')[0], email, role: 'admin', passwordHash };
    await User.updateOne({ email }, { $set: update }, { upsert: true });
  }
  // eslint-disable-next-line no-console
  console.log('Admin users ensured:', admins);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
