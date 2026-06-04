/**
 * Legacy data import script
 * Imports data from PHPMyAdmin JSON dump into MongoDB
 * Safe to re-run — deduplicates by slug/unique key
 *
 * Run: node scripts/import-legacy.mjs
 */

import { readFileSync } from 'fs';
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/safarearabia';
const JSON_FILE   = 'C:/Users/DELL/Downloads/u630620901_safarearabiant.json';
const IMG_BASE    = 'https://safarearabiantravel.com/storage/';

// ─── Helpers ──────────────────────────────────────────────────────────────

/** PHP stores numbered objects {"1":{...},"2":{...}} — convert to array */
function objToArr(val, fallback = []) {
  if (!val || val === 'null' || val === null) return fallback;
  try {
    const parsed = typeof val === 'string' ? JSON.parse(val) : val;
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === 'object') return Object.values(parsed);
    return fallback;
  } catch { return fallback; }
}

function toNum(v, def = 0) {
  const n = parseFloat(v);
  return isNaN(n) ? def : n;
}

function toImg(filename) {
  if (!filename) return '';
  if (filename.startsWith('http')) return filename;
  return IMG_BASE + filename;
}

function slugify(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ─── Load JSON dump ────────────────────────────────────────────────────────

console.log('Loading JSON file…');
const raw  = readFileSync(JSON_FILE, 'utf8');
const dump = JSON.parse(raw);

/** Get all rows from a named table */
function table(name) {
  const t = dump.find(d => d.type === 'table' && d.name === name);
  return t ? (t.data || []) : [];
}

// Pre-load all tables we need
const activitiesRows    = table('activities');
const activityGalleries = table('activities_galleries');
const toursRows         = table('tours');
const tourGalleries     = table('tour_galleries');
const transportsRows    = table('transports');
const transportGalleries= table('transport_galleries');
const blogsRows         = table('blogs');
const blogCategories    = table('blog_categories');
const visasRows         = table('visas');
const visaCategories    = table('visa_categories');
const tourCategories    = table('tour_categories');
const transportCats     = table('transport_categories');
const contactsRows      = table('contacts');
const inquiriesRows     = table('inquiries');
const invoicesRows      = table('invoices');
const invoiceUsersRows  = table('invoice_users');

// ─── Connect MongoDB ────────────────────────────────────────────────────────

console.log('Connecting to MongoDB…');
await mongoose.connect(MONGODB_URI);
console.log('Connected.\n');

const db = mongoose.connection.db;

// ─── Stat counters ──────────────────────────────────────────────────────────

const stats = {};
function initStat(name) { stats[name] = { inserted: 0, updated: 0, skipped: 0, errors: 0 }; }
function logResult(name, action) { if (stats[name]) stats[name][action]++; }

// ─── Activities ─────────────────────────────────────────────────────────────

initStat('activities');
console.log(`Importing ${activitiesRows.length} activities…`);

for (const row of activitiesRows) {
  try {
    const slug = row.slug || slugify(row.title);
    const galleries = activityGalleries
      .filter(g => g.activities_id === row.id)
      .map(g => toImg(g.image));

    const doc = {
      author_id:   parseInt(row.author_id) || 17,
      title:       row.title,
      shoulder:    row.shoulder || '',
      slug,
      content:     row.content || '',
      youtube_video: row.youtube_video || '',
      duration_days:   parseInt(row.days) || 1,
      duration_nights: parseInt(row.nights) || 0,
      min_people:  1,
      max_people:  parseInt(row.max_people) || 10,
      min_advance_reservations: parseInt(row.min_advance_reservations) || null,
      faqs:      objToArr(row.faqs),
      includes:  objToArr(row.includes),
      excludes:  objToArr(row.excludes),
      highlights:objToArr(row.highlights),
      pricing: {
        price:       toNum(row.price),
        sale_price:  toNum(row.sale_price),
        child_price: toNum(row.child_price),
        enable_service_fee: row.enable_service_fee === '1',
        service_fees: objToArr(row.service_fees),
      },
      location: {
        address:    row.address || '',
        country_id: parseInt(row.country_id) || null,
        state_id:   parseInt(row.state_id)   || null,
        city_id:    parseInt(row.city_id)    || null,
        zip_code:   row.zip_code || '',
        coordinates: {
          lat: toNum(row.map_lat) || null,
          lng: toNum(row.map_lng) || null,
        },
      },
      seo: {
        enable_seo:  !!row.enable_seo && row.enable_seo !== 'null',
        meta_title:  row.meta_title  || '',
        meta_desc:   row.meta_desc   || '',
        meta_keyward:row.meta_keyward|| '',
        meta_img:    toImg(row.meta_img),
      },
      attribute_terms: objToArr(row.attribute_terms).map(Number).filter(Boolean),
      galleries,
      feature_img: toImg(row.feature_img),
      status: parseInt(row.status) || 1,
      view:   parseInt(row.view)   || 0,
    };

    const res = await db.collection('activities').updateOne(
      { slug },
      { $setOnInsert: { ...doc, created_at: new Date(row.created_at), updated_at: new Date(row.updated_at) } },
      { upsert: true }
    );
    if (res.upsertedCount) logResult('activities', 'inserted');
    else                   logResult('activities', 'skipped');
  } catch (e) {
    logResult('activities', 'errors');
    console.error(`  Activity "${row.title}": ${e.message}`);
  }
}

// ─── Tours ──────────────────────────────────────────────────────────────────

initStat('tours');
console.log(`Importing ${toursRows.length} tours…`);

const tourCatMap = Object.fromEntries(tourCategories.map(c => [c.id, c]));

for (const row of toursRows) {
  try {
    const slug = row.slug || slugify(row.title);
    const galleries = tourGalleries
      .filter(g => g.tour_id === row.id)
      .map(g => toImg(g.image));
    const cat = tourCatMap[row.category_id];

    const itinerary = objToArr(row.itinerary);
    const fixedDates = objToArr(row.fixed_dates).map(d => ({
      start_date:   d.start_date   ? new Date(d.start_date)   : null,
      end_date:     d.end_date     ? new Date(d.end_date)     : null,
      booking_date: d.booking_date ? new Date(d.booking_date) : null,
    }));

    const doc = {
      author_id:  parseInt(row.author_id) || 17,
      title:      row.title,
      shoulder:   row.shoulder || '',
      slug,
      content:    row.content  || '',
      youtube_video: row.youtube_video || '',
      min_people: parseInt(row.min_people) || 1,
      max_people: parseInt(row.max_people) || 10,
      min_advance_reservations: parseInt(row.min_advance_reservations) || null,
      cancellation: parseInt(row.cancellation) || null,
      category: cat ? { name: cat.name, slug: cat.slug } : { name: '', slug: '' },
      faqs:      objToArr(row.faqs),
      includes:  objToArr(row.includes),
      excludes:  objToArr(row.excludes),
      highlights:objToArr(row.highlights),
      itinerary,
      pricing: {
        price:       toNum(row.price),
        sale_price:  toNum(row.sale_price),
        child_price: toNum(row.child_price),
        enable_service_fee: row.enable_service_fee === '1',
        service_fees: objToArr(row.service_fees),
      },
      location: {
        address:    row.address  || '',
        country_id: parseInt(row.country_id) || null,
        state_id:   parseInt(row.state_id)   || null,
        city_id:    parseInt(row.city_id)    || null,
        zip_code:   row.zip_code || '',
        coordinates: {
          lat: toNum(row.map_lat) || null,
          lng: toNum(row.map_lng) || null,
        },
      },
      scheduling: {
        enable_fixed_dates: row.enable_fixed_dates === '1',
        fixed_dates: fixedDates,
        enable_open_hours: row.enable_open_hours === '1',
        open_hours: row.open_hours ? JSON.parse(row.open_hours) : null,
      },
      attribute_terms: objToArr(row.attribute_terms).map(Number).filter(Boolean),
      galleries,
      features_image: toImg(row.features_image),
      youtube_image:  toImg(row.youtube_image),
      seo: {
        enable_seo:  row.enable_seo === '1',
        meta_title:  row.meta_title  || '',
        meta_desc:   row.meta_desc   || '',
        meta_keyward:row.meta_keyward|| '',
        meta_img:    toImg(row.meta_img),
      },
      status:      parseInt(row.status) || 1,
      view:        parseInt(row.view)   || 0,
      is_featured: row.is_featured === '1',
    };

    const res = await db.collection('tours').updateOne(
      { slug },
      { $setOnInsert: { ...doc, created_at: new Date(row.created_at), updated_at: new Date(row.updated_at) } },
      { upsert: true }
    );
    if (res.upsertedCount) logResult('tours', 'inserted');
    else                   logResult('tours', 'skipped');
  } catch (e) {
    logResult('tours', 'errors');
    console.error(`  Tour "${row.title}": ${e.message}`);
  }
}

// ─── Transports ─────────────────────────────────────────────────────────────

initStat('transports');
console.log(`Importing ${transportsRows.length} transports…`);

const tCatMap = Object.fromEntries(transportCats.map(c => [c.id, c]));

for (const row of transportsRows) {
  try {
    const slug = row.slug || slugify(row.title);
    const galleries = transportGalleries
      .filter(g => g.transport_id === row.id)
      .map(g => toImg(g.image));
    const cat = tCatMap[row.category_id];

    const doc = {
      author_id:  parseInt(row.author_id) || 17,
      title:      row.title,
      slug,
      content:    row.content    || '',
      youtube_url:row.youtube_video || '',
      category:   cat ? { name: cat.name, slug: cat.slug } : { name: '', slug: '' },
      car_type:   row.car_type   || '',
      car_person: parseInt(row.car_person)  || 0,
      distance_km:toNum(row.distance_km),
      car_price:  toNum(row.car_price),
      bus_price:  toNum(row.bus_price),
      train_price:toNum(row.train_price),
      boat_price: toNum(row.boat_price),
      pricing_car: {
        vehicle_type: row.car_type  || '',
        person:       parseInt(row.car_person) || 0,
        price:        toNum(row.car_price),
        sale_price:   toNum(row.car_sale_price),
        enable_extra_service: false,
      },
      pricing_bus: {
        adult_price:      toNum(row.bus_price),
        adult_sale_price: toNum(row.bus_sale_price),
        child_price:      toNum(row.bus_child_price),
        enable_extra_service: false,
      },
      pricing_train: {
        adult_price:      toNum(row.train_price),
        adult_sale_price: toNum(row.train_sale_price),
        child_price:      toNum(row.train_child_price),
        enable_extra_service: false,
      },
      pricing_boat: {
        adult_price:      toNum(row.boat_price),
        adult_sale_price: toNum(row.boat_sale_price),
        child_price:      toNum(row.boat_child_price),
        enable_extra_service: false,
      },
      min_advance_reservation: parseInt(row.min_advance_reservations) || null,
      min_day_stay:            parseInt(row.min_stay) || null,
      faqs:    objToArr(row.faqs),
      includes:objToArr(row.includes),
      excludes:objToArr(row.excludes),
      pricing: {
        enable_service_fee: row.enable_service_fee === '1',
        service_fees: objToArr(row.service_fees),
      },
      location: {
        address:    row.address  || '',
        country_id: parseInt(row.country_id) || null,
        state_id:   parseInt(row.state_id)   || null,
        city_id:    parseInt(row.city_id)    || null,
        zip_code:   row.zip_code || '',
        coordinates: {
          lat: toNum(row.map_lat) || null,
          lng: toNum(row.map_lng) || null,
        },
      },
      attribute_terms: objToArr(row.attribute_terms).map(Number).filter(Boolean),
      galleries,
      feature_img: toImg(row.feature_img),
      seo: {
        enable_seo:  !!row.enable_seo && row.enable_seo !== 'null',
        meta_title:  row.meta_title  || '',
        meta_desc:   row.meta_desc   || '',
        meta_keyward:row.meta_keyward|| '',
        meta_img:    toImg(row.meta_img),
      },
      status: parseInt(row.status) || 1,
      view:   parseInt(row.view)   || 0,
    };

    const res = await db.collection('transports').updateOne(
      { slug },
      { $setOnInsert: { ...doc, created_at: new Date(row.created_at), updated_at: new Date(row.updated_at) } },
      { upsert: true }
    );
    if (res.upsertedCount) logResult('transports', 'inserted');
    else                   logResult('transports', 'skipped');
  } catch (e) {
    logResult('transports', 'errors');
    console.error(`  Transport "${row.title}": ${e.message}`);
  }
}

// ─── Blogs ───────────────────────────────────────────────────────────────────

initStat('blogs');
console.log(`Importing ${blogsRows.length} blogs…`);

const blogCatMap = Object.fromEntries(blogCategories.map(c => [c.id, c]));

for (const row of blogsRows) {
  try {
    const slug = row.slug || slugify(row.title);
    const cat  = blogCatMap[row.category_id];
    const tags = row.tags ? row.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    const doc = {
      title:       row.title,
      slug,
      description: row.description || '',
      image:       toImg(row.image),
      category:    cat ? { name: cat.name, slug: cat.slug } : { name: '', slug: '' },
      tags,
      seo: {
        meta_title:       row.meta_title       || '',
        meta_keyward:     row.meta_keyward      || '',
        meta_description: row.meta_description  || '',
      },
      enable_seo: row.enable_seo === '1',
      status:     parseInt(row.status) || 1,
    };

    const res = await db.collection('blogs').updateOne(
      { slug },
      { $setOnInsert: { ...doc, created_at: new Date(row.created_at), updated_at: new Date(row.updated_at) } },
      { upsert: true }
    );
    if (res.upsertedCount) logResult('blogs', 'inserted');
    else                   logResult('blogs', 'skipped');
  } catch (e) {
    logResult('blogs', 'errors');
    console.error(`  Blog "${row.title}": ${e.message}`);
  }
}

// ─── Visas ───────────────────────────────────────────────────────────────────

initStat('visas');
console.log(`Importing ${visasRows.length} visas…`);

const visaCatMap = Object.fromEntries(visaCategories.map(c => [c.id, c]));

for (const row of visasRows) {
  try {
    const slug = row.slug || slugify(row.title);
    const cat  = visaCatMap[row.category_id];

    const doc = {
      author_id:    parseInt(row.author_id) || 17,
      title:        row.title,
      slug,
      category:     cat ? { name: cat.name } : { name: '' },
      maximum_stay: row.maximum_stay || '',
      processing:   row.processing   || '',
      validity:     row.validity     || '',
      visa_mode:    row.visa_mode    || '',
      cost:         toNum(row.cost),
      country_id:   parseInt(row.country_id) || null,
      features_image: toImg(row.features_image),
      banner_img:     toImg(row.banner_img),
      faqs:     objToArr(row.faqs),
      includes: objToArr(row.includes),
      required_documents: [],
      allow_seo: row.enable_seo === '1',
      seo: {
        enable_seo:  row.enable_seo === '1',
        meta_title:  row.meta_title  || '',
        meta_desc:   row.meta_desc   || '',
        meta_keyward:row.meta_keyward|| '',
        meta_img:    toImg(row.meta_img),
      },
      status: parseInt(row.status) || 1,
    };

    const res = await db.collection('visas').updateOne(
      { slug },
      { $setOnInsert: { ...doc, created_at: new Date(row.created_at), updated_at: new Date(row.updated_at) } },
      { upsert: true }
    );
    if (res.upsertedCount) logResult('visas', 'inserted');
    else                   logResult('visas', 'skipped');
  } catch (e) {
    logResult('visas', 'errors');
    console.error(`  Visa "${row.title}": ${e.message}`);
  }
}

// ─── Contacts ────────────────────────────────────────────────────────────────

initStat('contacts');
console.log(`Importing ${contactsRows.length} contacts…`);

for (const row of contactsRows) {
  try {
    // Deduplicate by email + created_at (PHP id stored as legacy_id)
    const existing = await db.collection('contacts').findOne({ legacy_id: row.id });
    if (existing) { logResult('contacts', 'skipped'); continue; }

    await db.collection('contacts').insertOne({
      legacy_id: row.id,
      name:     row.name    || '',
      email:    row.email   || '',
      phone:    row.phone   || '',
      subject:  row.subject || '',
      message:  row.message || '',
      status:   parseInt(row.status) || 0,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    });
    logResult('contacts', 'inserted');
  } catch (e) {
    logResult('contacts', 'errors');
  }
}

// ─── Inquiries (as contacts with type) ──────────────────────────────────────

initStat('inquiries');
console.log(`Importing ${inquiriesRows.length} inquiries…`);

for (const row of inquiriesRows) {
  try {
    const existing = await db.collection('contacts').findOne({ legacy_id: `inq_${row.id}` });
    if (existing) { logResult('inquiries', 'skipped'); continue; }

    await db.collection('contacts').insertOne({
      legacy_id:  `inq_${row.id}`,
      name:       row.name    || '',
      email:      row.email   || '',
      phone:      row.phone   || '',
      subject:    `Inquiry: ${row.type || ''}`,
      message:    row.message || '',
      inquiry_type: row.type  || '',
      product_id: row.product_id || '',
      status:     parseInt(row.status) || 0,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    });
    logResult('inquiries', 'inserted');
  } catch (e) {
    logResult('inquiries', 'errors');
  }
}

// ─── Hotel Invoices ──────────────────────────────────────────────────────────
// Each row in invoice_users with hotel fields → one HotelInvoice document
// category_id: 1=transport, 2=hotel, 3=visa

initStat('hotelinvoices');
console.log(`Importing ${invoicesRows.length} invoices (${invoiceUsersRows.length} line items)…`);

// Build a lookup map: invoice id → invoice header
const invoiceMap = Object.fromEntries(invoicesRows.map(inv => [inv.id, inv]));

// Hotel line items (category_id=2)
const hotelLineItems = invoiceUsersRows.filter(u => u.category_id === '2' || u.category_id === 2);
// Transport line items (category_id=1)
const transportLineItems = invoiceUsersRows.filter(u => u.category_id === '1' || u.category_id === 1);

initStat('transportinvoices');

for (const item of hotelLineItems) {
  try {
    const inv = invoiceMap[item.invoice_id];
    if (!inv) { logResult('hotelinvoices', 'skipped'); continue; }

    const legacyId = `h_${item.id}`;
    const existing = await db.collection('hotelinvoices').findOne({ legacy_id: legacyId });
    if (existing) { logResult('hotelinvoices', 'skipped'); continue; }

    await db.collection('hotelinvoices').insertOne({
      legacy_id:      legacyId,
      reserve_no:     parseInt(inv.reservation_no) || 0,
      reservation_no: inv.reservation_no || '',
      invoice_no:     inv.invoice_no     || '',
      option_date:    inv.option_date    || '',
      vat_number:     inv.vat_number     || '',
      client_ref_no:  inv.client_refno   || '',
      guest_name:     inv.guest_name     || '',
      contact_name:   inv.contact_name   || '',
      contact_number: inv.contact_number || '',
      account_name:   inv.account_name   || 'Safar e Arabian Travel & tours',
      bank:           inv.bank_name      || 'Faisal Bank',
      bank_account_no:inv.bank_account_no|| '3054301000007374',
      bank_address:   inv.bank_address   || '',
      // Hotel details from line item
      hotel_name:     item.hotel_name    || '',
      room_type:      item.room_type     || '',
      check_in:       item.check_in      || '',
      check_out:      item.check_out     || '',
      no_of_nights:   parseInt(item.no_of_nights) || 0,
      no_of_rooms:    parseInt(item.no_of_rooms)  || 1,
      no_of_adults:   parseInt(item.no_of_adults) || 0,
      no_of_children: parseInt(item.no_of_children) || 0,
      meals:          item.meals         || '',
      day_rate:       toNum(item.day_rate),
      ml_srate:       toNum(item.ml_srate),
      room_amount:    toNum(item.room_amount),
      conformation_no:item.conf_number   || '',
      total_amount:   toNum(inv.total_amount),
      sub_amount:     toNum(inv.sub_amount),
      status:         parseInt(inv.status) || 1,
      cancellation_policy: 'No-Cancellation or Amendment will be accepted after re-confirmation',
      no_show_policy: 'In-case of No-Show full invoice amount will be charged',
      created_at: new Date(inv.created_at),
      updated_at: new Date(inv.updated_at),
    });
    logResult('hotelinvoices', 'inserted');
  } catch (e) {
    logResult('hotelinvoices', 'errors');
    console.error(`  HotelInvoice item ${item.id}: ${e.message}`);
  }
}

for (const item of transportLineItems) {
  try {
    const inv = invoiceMap[item.invoice_id];
    if (!inv) { logResult('transportinvoices', 'skipped'); continue; }

    const legacyId = `t_${item.id}`;
    const existing = await db.collection('transportinvoices').findOne({ legacy_id: legacyId });
    if (existing) { logResult('transportinvoices', 'skipped'); continue; }

    await db.collection('transportinvoices').insertOne({
      legacy_id:       legacyId,
      invoice_no:      parseInt(inv.invoice_no) || 0,
      reservation_no:  inv.reservation_no  || '',
      guest_name:      inv.guest_name      || '',
      contact_name:    inv.contact_name    || '',
      contact_number:  inv.contact_number  || '',
      client_ref_no:   inv.client_refno    || '',
      reservation_date:inv.reservation_date|| '',
      username:        inv.username        || '',
      payment_type:    inv.payment_type    || '',
      // Transport details from line item
      date:            item.date           || '',
      time:            item.time           || '',
      from_location:   item.from           || '',
      to_location:     item.to             || '',
      vehicle:         item.vehicle        || '',
      qty:             parseInt(item.qty)  || 1,
      no_of_adults:    parseInt(item.no_of_adults) || 0,
      rate:            toNum(item.rate),
      total:           toNum(item.total),
      transport:       toNum(inv.transport),
      discount:        toNum(inv.discount),
      vat:             toNum(inv.vat),
      net_total_with_tax: toNum(inv.net_total_with_tax),
      account_name:    inv.account_name    || 'Safar E Arabian Travel & Tours',
      bank:            inv.bank_name       || 'Faisal Bank',
      bank_account_no: inv.bank_account_no || '3054301000007374',
      bank_address:    inv.bank_address    || '',
      cancellation_policy: 'No-Cancellation or Amendment will be accepted after re-confirmation',
      no_show_policy:  'In-case of No-Show full transport amount will be charged',
      status:          parseInt(inv.status) || 1,
      created_at: new Date(inv.created_at),
      updated_at: new Date(inv.updated_at),
    });
    logResult('transportinvoices', 'inserted');
  } catch (e) {
    logResult('transportinvoices', 'errors');
    console.error(`  TransportInvoice item ${item.id}: ${e.message}`);
  }
}

// ─── Summary ─────────────────────────────────────────────────────────────────

console.log('\n═══════════════════════════════════');
console.log('  Import Complete — Summary');
console.log('═══════════════════════════════════');
for (const [name, s] of Object.entries(stats)) {
  console.log(
    `  ${name.padEnd(20)} inserted: ${String(s.inserted).padStart(5)}` +
    `  skipped: ${String(s.skipped).padStart(5)}` +
    `  errors: ${String(s.errors).padStart(4)}`
  );
}
console.log('═══════════════════════════════════\n');

await mongoose.disconnect();
