/**
 * FINAL Invoice Migration — Safar e Arabian
 * ─────────────────────────────────────────
 * Rebuilds hotelinvoices + transportinvoices from the legacy JSON dump,
 * ONE document per legacy invoice header (no per-line-item duplicates),
 * preserving the real legacy invoice numbers and filling every field.
 *
 * Fixes vs. previous migrations:
 *   • invoice_no   = legacy transport_invoice_no  (was inv.id → wrong/duplicated)
 *   • reserve_no   = legacy reservation_no        (hotel, unique per invoice)
 *   • nationality  = locations[country_id].name   (was users.nationality → never existed)
 *   • vehicle/from/to = transport line items (category_id = null, identified by `vehicle`)
 *   • multi room / multi segment invoices → one doc, all rows kept in items[]
 *   • agent_no     = users.custom_id (e.g. MC0003)
 *
 * Usage:
 *   node scripts/migrate-invoices-final.mjs            # writes to $MONGODB_URI
 *   DRY=1 node scripts/migrate-invoices-final.mjs      # analyse only, no writes
 *   KEEP=1 node scripts/migrate-invoices-final.mjs     # do NOT drop, upsert by legacy_invoice_id
 */
import { readFileSync } from 'fs';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/safarearabia';
const JSON_FILE   = process.env.JSON_FILE   || 'C:/Users/DELL/Downloads/u630620901_safarearabiant.json';
const DRY  = process.env.DRY  === '1';
const KEEP = process.env.KEEP === '1';

// ─── helpers ────────────────────────────────────────────────────────────────
const toNum = (v, d = 0) => { const n = parseFloat(v); return isNaN(n) ? d : n; };
const toInt = (v, d = 0) => { const n = parseInt(v, 10); return isNaN(n) ? d : n; };
const safeDate = (v) => { if (!v) return null; const d = new Date(v); return isNaN(d.getTime()) ? null : d; };
const str = (v) => (v == null ? '' : String(v));

// ─── load dump ────────────────────────────────────────────────────────────────
console.log('Loading JSON dump …');
const dump = JSON.parse(readFileSync(JSON_FILE, 'utf8'));
const table = (name) => { const t = dump.find(d => d.type === 'table' && d.name === name); return t ? (t.data || []) : []; };

const invoices     = table('invoices');
const invoiceUsers = table('invoice_users');
const locations    = table('locations');
const usersRows    = table('users');

const locById  = Object.fromEntries(locations.map(l => [String(l.id), l]));
const userById = Object.fromEntries(usersRows.map(u => [String(u.id), u]));
const nationalityOf = (countryId) => locById[String(countryId)]?.name || '';

// group line items by invoice_id, preserving dump order
const liByInvoice = {};
for (const li of invoiceUsers) (liByInvoice[String(li.invoice_id)] ??= []).push(li);

const hotelHeaders     = invoices.filter(i => String(i.type) === '1');
const transportHeaders = invoices.filter(i => String(i.type) === '2');

console.log(`Hotel headers: ${hotelHeaders.length}  |  Transport headers: ${transportHeaders.length}`);

// ─── line-item mappers ───────────────────────────────────────────────────────
const isHotelLine     = (li) => str(li.hotel_name).trim() !== '';
const isTransportLine = (li) => str(li.vehicle).trim() !== '' || str(li.from).trim() !== '' || str(li.date).trim() !== '';

const mapHotelItem = (li) => ({
  hotel_name:     str(li.hotel_name),
  room_type:      str(li.room_type),
  check_in:       str(li.check_in),
  check_out:      str(li.check_out),
  no_of_nights:   toInt(li.no_of_nights),
  no_of_rooms:    toInt(li.no_of_rooms, 1),
  no_of_adults:   toInt(li.no_of_adults),
  no_of_children: toInt(li.no_of_children),
  meals:          str(li.meals),
  day_rate:       toNum(li.day_rate),
  ml_srate:       toNum(li.ml_srate),
  room_amount:    toNum(li.room_amount),
  conformation_no: str(li.conf_number),
});

const mapTransportItem = (li) => ({
  date:          str(li.date),
  time:          str(li.time),
  from_location: str(li.from),
  to_location:   str(li.to),
  vehicle:       str(li.vehicle),
  mov_type:      '',
  qty:           toInt(li.qty, 1),
  no_of_adults:  toInt(li.no_of_adults),
  packs:         '',
  rate:          toNum(li.rate),
  total:         toNum(li.total),
});

// ─── build documents ──────────────────────────────────────────────────────────
function buildHotelDocs(mongoUserByEmail) {
  const docs = [];
  for (const inv of hotelHeaders) {
    const author = userById[String(inv.author_id)];
    const items  = (liByInvoice[String(inv.id)] || []).filter(isHotelLine).map(mapHotelItem);
    const first  = items[0] || {};
    docs.push({
      legacy_invoice_id: toInt(inv.id),
      invoice_no:     toInt(inv.invoice_no),          // legacy hotel invoice no (001..)
      reserve_no:     toInt(inv.reservation_no),       // legacy reservation no (28900..)
      agent_user_id:  author ? (mongoUserByEmail[str(author.email).toLowerCase()] || null) : null,
      agent_name:     author ? `${str(author.fname)} ${str(author.lname)}`.trim() : '',
      agent_no:       author ? str(author.custom_id) : '',
      nationality:    nationalityOf(inv.country_id),
      guest_name:     str(inv.guest_name),
      option_date:    str(inv.option_date),
      client_ref_no:  str(inv.client_refno),
      vat_number:     str(inv.vat_number),
      contact_name:   str(inv.contact_name),
      group_no:       '',
      mobile_no:      author ? str(author.phone) : str(inv.contact_number),
      local_refno:    '',
      // flat (first room) — keeps current single-row UI working
      hotel_name:     str(first.hotel_name),
      city:           '',
      room_type:      str(first.room_type),
      check_in:       str(first.check_in),
      check_out:      str(first.check_out),
      no_of_nights:   toInt(first.no_of_nights),
      no_of_rooms:    toInt(first.no_of_rooms, 1),
      no_of_adults:   toInt(first.no_of_adults),
      no_of_children: toInt(first.no_of_children),
      packs:          '',
      meals:          str(first.meals),
      day_rate:       toNum(first.day_rate),
      ml_srate:       toNum(first.ml_srate),
      room_amount:    toNum(first.room_amount),
      conformation_no: str(first.conformation_no),
      total_amount:   toNum(inv.total_amount),
      sub_amount:     toNum(inv.sub_amount),
      items,                          // ALL rooms (fidelity)
      account_name:    str(inv.account_name) || 'Safar e Arabian Travel & tours',
      bank:            str(inv.bank_name) || 'Faisal Bank',
      bank_account_no: str(inv.bank_account_no) || '3054301000007374',
      bank_address:    str(inv.bank_address),
      ibn:             'PK65FAYS3054301000007374',
      important_contact: '',
      cancellation_policy: 'No-Cancellation or Amendment will be accepted after re-confirmation',
      no_show_policy: 'In-case of No-Show full invoice amount will be charged',
      status:     toInt(inv.status, 1),
      created_at: safeDate(inv.created_at) || new Date(),
      updated_at: safeDate(inv.updated_at) || new Date(),
    });
  }
  return docs;
}

function buildTransportDocs(mongoUserByEmail) {
  const docs = [];
  for (const inv of transportHeaders) {
    const author = userById[String(inv.author_id)];
    const items  = (liByInvoice[String(inv.id)] || []).filter(isTransportLine).map(mapTransportItem);
    const first  = items[0] || {};
    docs.push({
      legacy_invoice_id: toInt(inv.id),
      invoice_no:     toInt(inv.transport_invoice_no),
      agent_user_id:  author ? (mongoUserByEmail[str(author.email).toLowerCase()] || null) : null,
      // Legacy transport has no separate reservation no; the voucher labels the
      // invoice no as "Reservation No", so mirror it here (keeps the column populated).
      reservation_no: str(inv.transport_invoice_no),
      agent_name:     author ? `${str(author.fname)} ${str(author.lname)}`.trim() : '',
      agent_no:       author ? str(author.custom_id) : '',
      nationality:    nationalityOf(inv.country_id),
      guest_name:     str(inv.guest_name),
      contact_name:   str(inv.contact_name),
      contact_number: author ? str(author.phone) : str(inv.contact_number),
      client_ref_no:  str(inv.client_refno),
      group_no:       '',
      local_refno:    '',
      reservation_date: str(inv.reservation_date),
      username:       str(inv.username),
      payment_type:   str(inv.payment_type),
      // flat (first segment)
      date:           str(first.date),
      time:           str(first.time),
      from_location:  str(first.from_location),
      to_location:    str(first.to_location),
      vehicle:        str(first.vehicle),
      mov_type:       '',
      qty:            toInt(first.qty, 1),
      no_of_adults:   toInt(first.no_of_adults),
      packs:          '',
      rate:           toNum(first.rate),
      total:          toNum(first.total),
      items,                          // ALL segments (fidelity)
      transport:              toNum(inv.transport),
      discount:               toNum(inv.discount),
      vat:                    toNum(inv.vat),
      net_total_with_tax:     toNum(inv.net_total_with_tax) || toNum(inv.net_total),
      convert_rate_total_sar: toNum(inv.convert_rate),
      special_requirements:   '',
      notes:                  '',
      account_name:    str(inv.account_name) || 'Safar E Arabian Travel & Tours',
      bank:            str(inv.bank_name) || 'Faisal Bank',
      bank_account_no: str(inv.bank_account_no) || '3054301000007374',
      bank_address:    str(inv.bank_address),
      ibn:             'PK65FAYS3054301000007374',
      important_contact: '',
      cancellation_policy: 'No-Cancellation or Amendment will be accepted after re-confirmation',
      no_show_policy: 'In-case of No-Show full transport amount will be charged',
      status:     toInt(inv.status, 1),
      created_at: safeDate(inv.created_at) || new Date(),
      updated_at: safeDate(inv.updated_at) || new Date(),
    });
  }
  return docs;
}

// ─── run ────────────────────────────────────────────────────────────────────
console.log(`Connecting to Mongo (${MONGODB_URI.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@')}) …`);
await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 8000 });
const db = mongoose.connection.db;
console.log('Connected to DB:', db.databaseName, '\n');

// map mysql user → mongo user ObjectId by email
const mongoUsers = await db.collection('users').find({}, { projection: { email: 1 } }).toArray();
const mongoUserByEmail = {};
for (const mu of mongoUsers) if (mu.email) mongoUserByEmail[String(mu.email).toLowerCase()] = mu._id;
console.log(`Mongo users available for agent mapping: ${mongoUsers.length}`);

const hotelDocs     = buildHotelDocs(mongoUserByEmail);
const transportDocs = buildTransportDocs(mongoUserByEmail);

// report
const summarise = (docs, idField) => {
  const ids = docs.map(d => d[idField]).filter(Boolean);
  const withNat = docs.filter(d => d.nationality).length;
  const multi   = docs.filter(d => (d.items?.length || 0) > 1).length;
  return `count=${docs.length}  ${idField} ${Math.min(...ids)}..${Math.max(...ids)}  nationality_filled=${withNat}  multi-item=${multi}`;
};
console.log('\nHOTEL    ', summarise(hotelDocs, 'reserve_no'));
console.log('TRANSPORT', summarise(transportDocs, 'invoice_no'));
const tVeh = transportDocs.filter(d => d.vehicle).length;
console.log(`TRANSPORT vehicle filled on flat field: ${tVeh}/${transportDocs.length}`);
console.log('\nSample hotel doc   :', JSON.stringify({ ...hotelDocs[0], items: `[${hotelDocs[0].items.length}]` }, null, 0).slice(0, 600));
const tMulti = transportDocs.find(d => d.items.length > 1);
console.log('Sample multi-seg trn:', JSON.stringify({ invoice_no: tMulti.invoice_no, guest: tMulti.guest_name, nationality: tMulti.nationality, agent: tMulti.agent_name, items: tMulti.items }, null, 0).slice(0, 700));

if (DRY) {
  console.log('\nDRY RUN — no writes performed.');
  await mongoose.disconnect();
  process.exit(0);
}

// write
async function writeColl(name, docs, idField) {
  const C = db.collection(name);
  if (KEEP) {
    let up = 0;
    for (const d of docs) {
      await C.updateOne({ legacy_invoice_id: d.legacy_invoice_id }, { $set: d }, { upsert: true });
      up++;
    }
    console.log(`  ${name}: upserted ${up}`);
  } else {
    const before = await C.countDocuments();
    await C.deleteMany({});                 // clean slate (removes redundant duplicates)
    const res = await C.insertMany(docs, { ordered: false });
    console.log(`  ${name}: dropped ${before} → inserted ${res.insertedCount}`);
  }
  // helpful index
  try { await C.createIndex({ legacy_invoice_id: 1 }); } catch {}
  try { await C.createIndex({ [idField]: 1 }); } catch {}
}

console.log('\nWriting …');
await writeColl('hotelinvoices', hotelDocs, 'reserve_no');
await writeColl('transportinvoices', transportDocs, 'invoice_no');

// verify
const hCount = await db.collection('hotelinvoices').countDocuments();
const tCount = await db.collection('transportinvoices').countDocuments();
const hMax = (await db.collection('hotelinvoices').find({}, { projection: { reserve_no: 1 } }).sort({ reserve_no: -1 }).limit(1).toArray())[0]?.reserve_no;
const tMax = (await db.collection('transportinvoices').find({}, { projection: { invoice_no: 1 } }).sort({ invoice_no: -1 }).limit(1).toArray())[0]?.invoice_no;
console.log('\n═══ VERIFY ═══');
console.log(`hotelinvoices    : ${hCount} docs, max reserve_no = ${hMax}`);
console.log(`transportinvoices: ${tCount} docs, max invoice_no = ${tMax}`);
console.log('Done.');

await mongoose.disconnect();
