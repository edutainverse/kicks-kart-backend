import { loadEnv, env } from '../config/env.js';
import { connect } from '../db/connect.js';
import User from '../modules/users/user.model.js';
import { hashPassword } from '../utils/crypto.js';

const baseEmails = [
  'nvnjwl@gmail.com',
];

async function main() {
  loadEnv();
  await connect(env.MONGO_URI);
  const passwordHash = await hashPassword('passsword123');

  // Upsert the five base users (preserve existing role and password if user already exists)
  // This prevents accidentally changing admin passwords seeded elsewhere.
  for (const email of baseEmails) {
    const name = email.split('@')[0];
    await User.updateOne(
      { email },
      {
        $set: { name },
        $setOnInsert: { email, role: 'user', passwordHash },
      },
      { upsert: true }
    );
  }

  // Create user1..user50
  const bulk = [];
  for (let i = 1; i <= 50; i++) {
    const email = `user${i}@gmail.com`;
    bulk.push({
      updateOne: {
        filter: { email },
        update: {
          $set: { name: `user${i}` },
          $setOnInsert: { email, role: 'user', passwordHash },
        },
        upsert: true,
      },
    });
  }
  if (bulk.length) await User.bulkWrite(bulk);

  // eslint-disable-next-line no-console
  console.log('Users ensured:', baseEmails.length + 50);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
