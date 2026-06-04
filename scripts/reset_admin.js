const bcrypt = require('/var/www/safarearabia/node_modules/bcryptjs');
const { MongoClient } = require('/var/www/safarearabia/node_modules/mongodb');

async function run() {
  const hash = await bcrypt.hash('Admin@12345', 10);
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('safarearabia');

  const result = await db.collection('users').updateMany(
    { role: 1 },
    { $set: { password: hash, status: 1 } }
  );
  console.log('Updated admin users:', result.modifiedCount);

  const admins = await db.collection('users').find(
    { role: 1 },
    { projection: { email: 1, role: 1, status: 1 } }
  ).toArray();
  console.log('Admin accounts:', JSON.stringify(admins, null, 2));
  await client.close();
}
run().catch(console.error);
