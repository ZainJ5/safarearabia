/**
 * Read-only inspection of the server MongoDB.
 * Tries the connection string passed via MONGODB_URI env, with a short timeout.
 */
import mongoose from 'mongoose';

const URI = process.env.MONGODB_URI;
if (!URI) { console.error('No MONGODB_URI provided'); process.exit(2); }

const safeUri = URI.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@');
console.log('Connecting to:', safeUri);

try {
  await mongoose.connect(URI, { serverSelectionTimeoutMS: 6000 });
  console.log('CONNECTED.\n');
  const db = mongoose.connection.db;
  console.log('DB name:', db.databaseName);
  const colls = await db.listCollections().toArray();
  const rows = [];
  for (const c of colls.sort((a, b) => a.name.localeCompare(b.name))) {
    rows.push([c.name, await db.collection(c.name).countDocuments()]);
  }
  console.log('\n=== COLLECTION COUNTS ===');
  for (const [n, c] of rows) console.log('  ' + n.padEnd(28) + c);

  // Focus on the two invoice collections
  for (const coll of ['transportinvoices', 'hotelinvoices']) {
    if (!colls.find(c => c.name === coll)) continue;
    const C = db.collection(coll);
    const total = await C.countDocuments();
    const idField = coll === 'transportinvoices' ? 'invoice_no' : 'reserve_no';
    const top = await C.find({}, { projection: { [idField]: 1, guest_name: 1, agent_name: 1, vehicle: 1, nationality: 1, reservation_no: 1, hotel_name: 1, legacy_id: 1 } })
      .sort({ [idField]: -1 }).limit(3).toArray();
    const min = await C.find({}, { projection: { [idField]: 1 } }).sort({ [idField]: 1 }).limit(1).toArray();
    console.log(`\n=== ${coll} (total ${total}) ===`);
    console.log(`  ${idField} min:`, min[0]?.[idField], ' top3:', JSON.stringify(top));
  }
  await mongoose.disconnect();
  process.exit(0);
} catch (e) {
  console.error('CONNECT FAILED:', e.message);
  process.exit(1);
}
