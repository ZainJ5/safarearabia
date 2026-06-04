// Exports all MongoDB collections as JSON files for migration
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/safarearabia';
const OUT_DIR = path.join(__dirname, '../db_export');

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const client = new MongoClient(URI);
  await client.connect();
  const dbName = new URL(URI).pathname.slice(1);
  const db = client.db(dbName);
  const collections = await db.listCollections().toArray();

  console.log(`Database: ${dbName}`);
  console.log(`Found ${collections.length} collections`);

  for (const col of collections) {
    const name = col.name;
    const docs = await db.collection(name).find({}).toArray();
    const file = path.join(OUT_DIR, `${name}.json`);
    fs.writeFileSync(file, JSON.stringify(docs, null, 2));
    console.log(`  Exported ${name}: ${docs.length} documents -> ${file}`);
  }

  await client.close();
  console.log('\nExport complete!');
}

main().catch(e => { console.error(e); process.exit(1); });
