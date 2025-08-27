import { loadEnv, env } from '../config/env.js';
import { connect } from '../db/connect.js';
import User from '../modules/users/user.model.js';
import { hashPassword } from '../utils/crypto.js';

const baseEmails = [
  'slikeqa@gmail.com',
  'nvnjwl@gmail.com',
  'admin@edutainverse.com',
  'admin@kickskart.com',
  'admin@kickscart.local',
];

async function main() {
  loadEnv();
  await connect(env.MONGO_URI);
  const passwordHash = await hashPassword('passsword123');

  // Upsert the five base users (keep existing role if present, default to 'user')
  for (const email of baseEmails) {
    const existing = await User.findOne({ email });
    const role = existing?.role || 'user';
    const update = { name: email.split('@')[0], email, role, passwordHash };
    await User.updateOne({ email }, { $set: update }, { upsert: true });
  }

  // Create user1..user50
  const bulk = [];
  for (let i = 1; i <= 50; i++) {
    const email = `user${i}@gmail.com`;
    bulk.push({ updateOne: { filter: { email }, update: { $set: { name: `user${i}`, email, role: 'user', passwordHash } }, upsert: true } });
  }
  if (bulk.length) await User.bulkWrite(bulk);

  // eslint-disable-next-line no-console
  console.log('Users ensured:', baseEmails.length + 50);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
