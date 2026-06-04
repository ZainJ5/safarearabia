/**
 * One-time fix: replace the non-sparse username_1 index with a sparse one.
 *
 * The old index treats every null username as a duplicate key, blocking
 * creation of more than one user without a username.
 *
 * Run from the safarearabia/ directory:
 *   node scripts/fix-username-index.js
 */

const { MongoClient } = require('mongodb');
const path = require('path');
const fs   = require('fs');

// Load .env.local manually (dotenv may not be installed globally)
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const [key, ...rest] = line.split('=');
    if (key && key.trim() && !key.startsWith('#')) {
      process.env[key.trim()] = rest.join('=').trim().replace(/^['"]|['"]$/g, '');
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/safarearabia';

async function run() {
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();

    // Derive DB name from URI (fallback to 'safarearabia')
    const dbName = MONGODB_URI.split('/').pop().split('?')[0] || 'safarearabia';
    const db  = client.db(dbName);
    const col = db.collection('users');

    // 1. Drop the old non-sparse index (ignore error if it doesn't exist)
    try {
      await col.dropIndex('username_1');
      console.log('✓ Dropped old non-sparse username_1 index');
    } catch (e) {
      console.log('  (username_1 not found or already dropped — continuing)');
    }

    // 2. Recreate as sparse + unique so null values are not indexed
    await col.createIndex(
      { username: 1 },
      { unique: true, sparse: true, name: 'username_1' }
    );
    console.log('✓ Created sparse unique index on username');

    // 3. Show current indexes for confirmation
    const indexes = await col.indexes();
    console.log('\nCurrent users collection indexes:');
    indexes.forEach(i => console.log(' ', i.name, JSON.stringify(i.key)));

    console.log('\n✅ Fix complete — you can now create multiple users without a username.');
  } finally {
    await client.close();
  }
}

run().catch(err => { console.error('❌ Error:', err.message); process.exit(1); });
