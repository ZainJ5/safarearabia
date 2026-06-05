/**
 * Analysis-only script — reads the legacy JSON dump and reports the facts
 * needed to design a correct invoice migration. Does NOT touch MongoDB.
 *
 * Run: node scripts/analyze-legacy.mjs
 */
import { readFileSync } from 'fs';

const JSON_FILE = 'C:/Users/DELL/Downloads/u630620901_safarearabiant.json';

const dump = JSON.parse(readFileSync(JSON_FILE, 'utf8'));
const table = (name) => {
  const t = dump.find(d => d.type === 'table' && d.name === name);
  return t ? (t.data || []) : [];
};

const invoices     = table('invoices');
const invoiceUsers = table('invoice_users');
const locations    = table('locations');
const users        = table('users');

const num = (v) => { const n = parseInt(v, 10); return isNaN(n) ? null : n; };

console.log('=== TABLE LIST (name : rows) ===');
for (const d of dump.filter(x => x.type === 'table')) {
  console.log(`  ${String(d.name).padEnd(40)} ${(d.data || []).length}`);
}

console.log('\n=== INVOICES ===');
console.log('total invoices:', invoices.length);
const byType = {};
for (const inv of invoices) {
  const t = String(inv.type);
  (byType[t] ??= []).push(inv);
}
for (const [t, rows] of Object.entries(byType)) {
  const ids = rows.map(r => num(r.id)).filter(x => x != null);
  console.log(`  type=${t}  count=${rows.length}  id range ${Math.min(...ids)}..${Math.max(...ids)}`);
}

// line items grouped by invoice_id
const liByInvoice = {};
for (const li of invoiceUsers) (liByInvoice[li.invoice_id] ??= []).push(li);

console.log('\n=== INVOICE_USERS (line items) ===');
console.log('total line items:', invoiceUsers.length);
const liByCat = {};
for (const li of invoiceUsers) (liByCat[String(li.category_id)] ??= []).push(li);
for (const [c, rows] of Object.entries(liByCat)) {
  const withVehicle = rows.filter(r => r.vehicle && String(r.vehicle).trim()).length;
  const withHotel   = rows.filter(r => r.hotel_name && String(r.hotel_name).trim()).length;
  const withFrom    = rows.filter(r => r.from && String(r.from).trim()).length;
  console.log(`  category_id=${c}  count=${rows.length}  vehicle!=∅:${withVehicle}  hotel_name!=∅:${withHotel}  from!=∅:${withFrom}`);
}

// For each invoice type, how many line items per header
function lineItemStats(typeRows, label) {
  let zero = 0, one = 0, many = 0, totalLi = 0;
  for (const inv of typeRows) {
    const n = (liByInvoice[inv.id] || []).length;
    totalLi += n;
    if (n === 0) zero++; else if (n === 1) one++; else many++;
  }
  console.log(`  ${label}: headers=${typeRows.length}  lineItems(total)=${totalLi}  headers w/0=${zero} w/1=${one} w/>1=${many}`);
}
console.log('\n=== LINE ITEMS PER HEADER ===');
lineItemStats(byType['1'] || [], 'HOTEL  (type=1)');
lineItemStats(byType['2'] || [], 'TRANSP (type=2)');
lineItemStats(byType['3'] || [], 'VISA   (type=3)');

// Transport header identifier fields
console.log('\n=== TRANSPORT HEADER FIELDS (type=2) — first 12 ===');
for (const inv of (byType['2'] || []).slice(0, 12)) {
  console.log(`  id=${inv.id} invoice_no=${JSON.stringify(inv.invoice_no)} transport_invoice_no=${JSON.stringify(inv.transport_invoice_no)} reservation_no=${JSON.stringify(inv.reservation_no)} transport_reservation_no=${JSON.stringify(inv.transport_reservation_no)} country_id=${inv.country_id} guest=${JSON.stringify(inv.guest_name)}`);
}

// distinct value frequency helper
function topFreq(rows, field, n = 12) {
  const f = {};
  for (const r of rows) { const k = JSON.stringify(r[field]); f[k] = (f[k]||0)+1; }
  return Object.entries(f).sort((a,b)=>b[1]-a[1]).slice(0, n);
}
console.log('\n  transport_reservation_no freq:', topFreq(byType['2']||[], 'transport_reservation_no'));
console.log('  transport_invoice_no  freq:', topFreq(byType['2']||[], 'transport_invoice_no'));
console.log('  reservation_no        freq:', topFreq(byType['2']||[], 'reservation_no'));

// Hotel header reservation numbers
console.log('\n=== HOTEL HEADER FIELDS (type=1) — first 6 ===');
for (const inv of (byType['1'] || []).slice(0, 6)) {
  console.log(`  id=${inv.id} invoice_no=${JSON.stringify(inv.invoice_no)} reservation_no=${JSON.stringify(inv.reservation_no)} country_id=${inv.country_id} guest=${JSON.stringify(inv.guest_name)}`);
}
const hotelReserve = (byType['1']||[]).map(r=>num(r.reservation_no)).filter(x=>x!=null);
console.log('  hotel reservation_no range:', Math.min(...hotelReserve), '..', Math.max(...hotelReserve), 'count w/number:', hotelReserve.length);

// Country / nationality mapping
console.log('\n=== COUNTRY_ID USAGE IN INVOICES ===');
const locById = Object.fromEntries(locations.map(l => [String(l.id), l]));
const countryFreq = {};
for (const inv of invoices) { const k = String(inv.country_id); countryFreq[k] = (countryFreq[k]||0)+1; }
for (const [cid, cnt] of Object.entries(countryFreq).sort((a,b)=>b[1]-a[1]).slice(0,15)) {
  const loc = locById[cid];
  console.log(`  country_id=${cid.padEnd(6)} count=${String(cnt).padStart(4)}  -> ${loc ? loc.name : '(no location row)'}`);
}

// users: nationality field?
console.log('\n=== USERS ===');
console.log('total users:', users.length);
console.log('sample user keys:', Object.keys(users[0] || {}).join(', '));
console.log('has nationality field:', Object.keys(users[0]||{}).includes('nationality'));

console.log('\nDONE.');
