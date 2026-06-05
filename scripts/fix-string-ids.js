/* Convert string _id -> real ObjectId (preserving the hex value) for admin-CRUD
 * content collections whose _id is NOT referenced by other collections.
 * Run with: mongosh "mongodb://localhost:27017/safarearabia" fix-string-ids.js
 * Excludes users/wallets/stores/orders/settings (auth/reference/sensitive).
 */
const COLLS = [
  'transportcategories', 'tourcategories', 'visacategories', 'hotelcategories', 'blogcategories',
  'hotels', 'sliders', 'testimonials', 'pages', 'menus', 'hotelattributes',
  'paymentmethods', 'currencies', 'languages', 'emailtemplates',
  'subscribers', 'supporttickets', 'visaapplications',
];

const hex24 = /^[0-9a-fA-F]{24}$/;
let grand = 0;

for (const cn of COLLS) {
  const c = db.getCollection(cn);
  const before = c.countDocuments();
  const docs = c.find({ _id: { $type: 'string' } }).toArray();
  let conv = 0, fresh = 0, fail = 0;
  for (const d of docs) {
    const sid = d._id;
    const nid = hex24.test(sid) ? ObjectId(sid) : new ObjectId();
    if (!hex24.test(sid)) fresh++;
    // skip if the target ObjectId somehow already exists
    if (c.findOne({ _id: nid })) { c.deleteOne({ _id: sid }); conv++; continue; }
    const nd = Object.assign({}, d, { _id: nid });
    // delete first to avoid unique-index (e.g. slug) collision, then insert
    c.deleteOne({ _id: sid });
    try { c.insertOne(nd); conv++; }
    catch (e) { fail++; print(`  !! ${cn} ${sid}: ${e.message}`); }
  }
  const after = c.countDocuments();
  const remain = c.countDocuments({ _id: { $type: 'string' } });
  if (docs.length) print(`${cn.padEnd(22)} before=${before} after=${after} converted=${conv} newId(nonhex)=${fresh} fail=${fail} stringLeft=${remain}`);
  grand += conv;
}
print(`\nTOTAL converted: ${grand}`);
