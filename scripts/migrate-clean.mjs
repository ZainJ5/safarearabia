/**
 * Clean Migration Script for safarearabia
 * ────────────────────────────────────────
 * Drops and re-imports invoices correctly, updates existing collections
 * with translations, cleans spam, and seeds missing data.
 *
 * Run: node scripts/migrate-clean.mjs
 */

import { readFileSync } from 'fs';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/safarearabia';
const JSON_FILE   = process.env.JSON_FILE   || 'C:/Users/DELL/Downloads/u630620901_safarearabiant.json';
const IMG_BASE    = 'https://safarearabiantravel.com/storage/';

// ─── Helpers ──────────────────────────────────────────────────────────────

/** PHP stores numbered objects {"1":{...},"2":{...}} — convert to array */
function objToArr(val, fallback = []) {
  if (!val || val === 'null' || val === null || val === '') return fallback;
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

function toInt(v, def = 0) {
  const n = parseInt(v, 10);
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

function safeDate(v) {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
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

// Pre-load all tables
const activitiesRows       = table('activities');
const activityGalleries    = table('activities_galleries');
const activityTranslations = table('activities_translations');
const toursRows            = table('tours');
const tourGalleries        = table('tour_galleries');
const tourTranslations     = table('tour_translations');
const tourCategories       = table('tour_categories');
const transportsRows       = table('transports');
const transportGalleries   = table('transport_galleries');
const transportTranslations= table('transport_translations');
const transportCats        = table('transport_categories');
const blogsRows            = table('blogs');
const blogCategories       = table('blog_categories');
const blogTranslations     = table('blog_translations');
const blogComments         = table('blog_comments');
const visasRows            = table('visas');
const visaCategories       = table('visa_categories');
const visaTranslations     = table('visa_translations');
const contactsRows         = table('contacts');
const invoicesRows         = table('invoices');
const invoiceUsersRows     = table('invoice_users');
const usersRows            = table('users');
const settingsRows         = table('settings');

console.log(`Loaded: ${invoicesRows.length} invoices, ${invoiceUsersRows.length} invoice line items, ${usersRows.length} users`);

// ─── Connect MongoDB ────────────────────────────────────────────────────────

console.log('Connecting to MongoDB…');
await mongoose.connect(MONGODB_URI);
console.log('Connected.\n');

const db = mongoose.connection.db;

// ─── Build lookup maps ──────────────────────────────────────────────────────

// Map MySQL user id → MongoDB user ObjectId
const mongoUsers = await db.collection('users').find({}).toArray();
const mysqlUserToMongoId = {};
for (const u of usersRows) {
  // Match by email (case-insensitive)
  const mongoUser = mongoUsers.find(mu => 
    mu.email && u.email && mu.email.toLowerCase() === u.email.toLowerCase()
  );
  if (mongoUser) {
    mysqlUserToMongoId[u.id] = mongoUser._id;
  }
}
console.log(`Mapped ${Object.keys(mysqlUserToMongoId).length} MySQL users → MongoDB ObjectIds\n`);

// Build category maps
const tourCatMap  = Object.fromEntries(tourCategories.map(c => [c.id, c]));
const blogCatMap  = Object.fromEntries(blogCategories.map(c => [c.id, c]));
const visaCatMap  = Object.fromEntries(visaCategories.map(c => [c.id, c]));
const tCatMap     = Object.fromEntries(transportCats.map(c => [c.id, c]));

// Build invoice lookup
const invoiceMap = Object.fromEntries(invoicesRows.map(inv => [inv.id, inv]));

// Build translations by entity ID and locale
function buildTransMap(rows, idField) {
  const map = {};
  for (const row of rows) {
    const id = row[idField];
    if (!map[id]) map[id] = {};
    map[id][row.lang || row.locale || 'en'] = row;
  }
  return map;
}

const tourTransMap      = buildTransMap(tourTranslations, 'tour_id');
const activityTransMap  = buildTransMap(activityTranslations, 'activities_id');
const blogTransMap      = buildTransMap(blogTranslations, 'blog_id');
const transportTransMap = buildTransMap(transportsRows.length ? transportTranslations : [], 'transport_id');
const visaTransMap      = buildTransMap(visaTranslations, 'visa_id');

// ─── Stat counters ──────────────────────────────────────────────────────────

const stats = {};
function initStat(name) { stats[name] = { inserted: 0, updated: 0, skipped: 0, errors: 0 }; }
function logResult(name, action) { if (stats[name]) stats[name][action]++; }

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 1: DROP & RE-IMPORT HOTEL INVOICES
// ═══════════════════════════════════════════════════════════════════════════

initStat('hotelinvoices');
console.log('═══ PHASE 1a: Hotel Invoices ═══');
console.log('Dropping hotelinvoices collection…');
try { await db.collection('hotelinvoices').drop(); } catch (e) { /* may not exist */ }

// Hotel invoices: type=1 in invoices table
const hotelInvoiceHeaders = invoicesRows.filter(inv => inv.type === '1' || inv.type === 1);
console.log(`Found ${hotelInvoiceHeaders.length} hotel invoice headers`);

// Build invoice_users by invoice_id for fast lookup
const lineItemsByInvoice = {};
for (const item of invoiceUsersRows) {
  const iid = item.invoice_id;
  if (!lineItemsByInvoice[iid]) lineItemsByInvoice[iid] = [];
  lineItemsByInvoice[iid].push(item);
}

// Also build users map by id for agent info
const userById = Object.fromEntries(usersRows.map(u => [u.id, u]));

for (const inv of hotelInvoiceHeaders) {
  try {
    const lineItems = lineItemsByInvoice[inv.id] || [];
    const agentUser = userById[inv.author_id];
    const agentMongoId = mysqlUserToMongoId[inv.author_id] || null;

    // If there are line items, create one hotel invoice per line item
    // If no line items, create a single header-only invoice
    const items = lineItems.length > 0 ? lineItems : [null];

    for (const li of items) {
      const doc = {
        reserve_no:     toInt(inv.reservation_no),
        agent_user_id:  agentMongoId,
        // Agent info from user lookup
        agent_name:     agentUser ? `${agentUser.fname} ${agentUser.lname}`.trim() : '',
        agent_no:       agentUser ? `MC${String(agentUser.id).padStart(4, '0')}` : '',
        nationality:    agentUser ? (agentUser.nationality || '') : '',
        guest_name:     inv.guest_name || '',
        option_date:    inv.option_date || '',
        client_ref_no:  inv.client_refno || '',
        vat_number:     inv.vat_number || '',
        contact_name:   inv.contact_name || '',
        group_no:       '',
        mobile_no:      agentUser ? (agentUser.phone || '') : '',
        local_refno:    '',
        // Hotel details from line item (or empty)
        hotel_name:     li ? (li.hotel_name || '') : '',
        city:           '', // Will be derived if possible
        room_type:      li ? (li.room_type || '') : '',
        check_in:       li ? (li.check_in || '') : '',
        check_out:      li ? (li.check_out || '') : '',
        no_of_nights:   li ? toInt(li.no_of_nights) : 0,
        no_of_rooms:    li ? toInt(li.no_of_rooms, 1) : 1,
        no_of_adults:   li ? toInt(li.no_of_adults) : 0,
        no_of_children: li ? toInt(li.no_of_children) : 0,
        packs:          '',
        meals:          li ? (li.meals || '') : '',
        day_rate:       li ? toNum(li.day_rate) : 0,
        ml_srate:       li ? toNum(li.ml_srate) : 0,
        room_amount:    li ? toNum(li.room_amount) : 0,
        conformation_no: li ? (li.conf_number || '') : '',
        total_amount:   toNum(inv.total_amount),
        sub_amount:     toNum(inv.sub_amount),
        // Bank details
        account_name:    inv.account_name || 'Safar e Arabian Travel & tours',
        bank:            inv.bank_name || 'Faisal Bank',
        bank_account_no: inv.bank_account_no || '3054301000007374',
        bank_address:    inv.bank_address || '',
        ibn:             'PK65FAYS3054301000007374',
        // Policies
        important_contact:    '',
        cancellation_policy:  'No-Cancellation or Amendment will be accepted after re-confirmation',
        no_show_policy:       'In-case of No-Show full invoice amount will be charged',
        status: toInt(inv.status, 1),
        created_at: safeDate(inv.created_at) || new Date(),
        updated_at: safeDate(inv.updated_at) || new Date(),
      };

      await db.collection('hotelinvoices').insertOne(doc);
      logResult('hotelinvoices', 'inserted');
    }
  } catch (e) {
    logResult('hotelinvoices', 'errors');
    console.error(`  HotelInvoice ${inv.id}: ${e.message}`);
  }
}

console.log(`Hotel invoices: inserted=${stats.hotelinvoices.inserted}, errors=${stats.hotelinvoices.errors}\n`);

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 1b: DROP & RE-IMPORT TRANSPORT INVOICES
// ═══════════════════════════════════════════════════════════════════════════

initStat('transportinvoices');
console.log('═══ PHASE 1b: Transport Invoices ═══');
console.log('Dropping transportinvoices collection…');
try { await db.collection('transportinvoices').drop(); } catch (e) { /* may not exist */ }

// Transport invoices: type=2 in invoices table
const transportInvoiceHeaders = invoicesRows.filter(inv => inv.type === '2' || inv.type === 2);
console.log(`Found ${transportInvoiceHeaders.length} transport invoice headers`);

for (const inv of transportInvoiceHeaders) {
  try {
    const lineItems = lineItemsByInvoice[inv.id] || [];
    const agentUser = userById[inv.author_id];
    const agentMongoId = mysqlUserToMongoId[inv.author_id] || null;

    // If there are line items, create one transport invoice per line item
    const items = lineItems.length > 0 ? lineItems : [null];

    for (const li of items) {
      const doc = {
        invoice_no:       toInt(inv.id),
        agent_user_id:    agentMongoId,
        reservation_no:   inv.transport_reservation_no || inv.reservation_no || '',
        // Agent info
        agent_name:       agentUser ? `${agentUser.fname} ${agentUser.lname}`.trim() : '',
        agent_no:         agentUser ? `MC${String(agentUser.id).padStart(4, '0')}` : '',
        nationality:      agentUser ? (agentUser.nationality || '') : '',
        guest_name:       inv.guest_name || '',
        contact_name:     inv.contact_name || '',
        contact_number:   inv.contact_number || '',
        client_ref_no:    inv.client_refno || '',
        group_no:         '',
        local_refno:      '',
        reservation_date: inv.reservation_date || '',
        username:         inv.username || '',
        payment_type:     inv.payment_type || '',
        // Transport details from line item
        date:             li ? (li.date || '') : '',
        time:             li ? (li.time || '') : '',
        from_location:    li ? (li.from || '') : '',
        to_location:      li ? (li.to || '') : '',
        vehicle:          li ? (li.vehicle || '') : '',
        mov_type:         '',
        qty:              li ? toInt(li.qty, 1) : 1,
        no_of_adults:     li ? toInt(li.no_of_adults) : 0,
        packs:            '',
        rate:             li ? toNum(li.rate) : 0,
        total:            li ? toNum(li.total) : 0,
        // Financial summary
        transport:              toNum(inv.transport),
        discount:               toNum(inv.discount),
        vat:                    toNum(inv.vat),
        net_total_with_tax:     toNum(inv.net_total_with_tax || inv.net_total),
        convert_rate_total_sar: toNum(inv.convert_rate),
        special_requirements:   '',
        notes:                  '',
        // Bank details
        account_name:     inv.account_name || 'Safar E Arabian Travel & Tours',
        bank:             inv.bank_name || 'Faisal Bank',
        bank_account_no:  inv.bank_account_no || '3054301000007374',
        bank_address:     inv.bank_address || '',
        ibn:              'PK65FAYS3054301000007374',
        important_contact: '',
        cancellation_policy: 'No-Cancellation or Amendment will be accepted after re-confirmation',
        no_show_policy:   'In-case of No-Show full transport amount will be charged',
        status:           toInt(inv.status, 1),
        created_at: safeDate(inv.created_at) || new Date(),
        updated_at: safeDate(inv.updated_at) || new Date(),
      };

      await db.collection('transportinvoices').insertOne(doc);
      logResult('transportinvoices', 'inserted');
    }
  } catch (e) {
    logResult('transportinvoices', 'errors');
    console.error(`  TransportInvoice ${inv.id}: ${e.message}`);
  }
}

console.log(`Transport invoices: inserted=${stats.transportinvoices.inserted}, errors=${stats.transportinvoices.errors}\n`);

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 2: UPDATE TOURS WITH TRANSLATIONS & CATEGORY ICONS
// ═══════════════════════════════════════════════════════════════════════════

initStat('tours');
console.log('═══ PHASE 2: Updating Tours ═══');

for (const row of toursRows) {
  try {
    const slug = row.slug || slugify(row.title);
    const galleries = tourGalleries
      .filter(g => g.tour_id === row.id)
      .map(g => toImg(g.image));
    const cat = tourCatMap[row.category_id];

    // Build translations
    const trans = tourTransMap[row.id] || {};
    const translations = {};
    for (const [lang, t] of Object.entries(trans)) {
      translations[lang] = {
        title:    t.title || '',
        shoulder: t.shoulder || '',
        content:  t.content || '',
      };
    }

    const itinerary = objToArr(row.itinerary);
    const fixedDates = objToArr(row.fixed_dates).map(d => ({
      start_date:   safeDate(d.start_date),
      end_date:     safeDate(d.end_date),
      booking_date: safeDate(d.booking_date),
    }));

    const updateDoc = {
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
      category: cat ? { name: cat.name, slug: cat.slug || slugify(cat.name), icon: cat.icon || '' } : { name: '', slug: '', icon: '' },
      faqs:      objToArr(row.faqs),
      includes:  objToArr(row.includes),
      excludes:  objToArr(row.excludes),
      highlights:objToArr(row.highlights),
      itinerary,
      pricing: {
        price:       toNum(row.price),
        sale_price:  toNum(row.sale_price),
        child_price: toNum(row.child_price),
        enable_person_types: row.enable_person_types === '1',
        enable_extra_price: row.enable_extra_price === '1',
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
      destination: {
        name: '', // destination_id lookup would need destinations table
        sub_destinations: objToArr(row.sub_destination),
      },
      scheduling: {
        enable_fixed_dates: row.enable_fixed_dates === '1',
        fixed_dates: fixedDates,
        enable_open_hours: row.enable_open_hours === '1',
        open_hours: row.open_hours ? (typeof row.open_hours === 'string' ? JSON.parse(row.open_hours) : row.open_hours) : null,
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
      translations,
      status:      parseInt(row.status) || 1,
      view:        parseInt(row.view)   || 0,
      is_featured: row.is_featured === '1' || row.is_featured === 1,
      updated_at:  safeDate(row.updated_at) || new Date(),
    };

    const res = await db.collection('tours').updateOne(
      { slug },
      { $set: updateDoc, $setOnInsert: { created_at: safeDate(row.created_at) || new Date() } },
      { upsert: true }
    );
    if (res.upsertedCount) logResult('tours', 'inserted');
    else if (res.modifiedCount) logResult('tours', 'updated');
    else logResult('tours', 'skipped');
  } catch (e) {
    logResult('tours', 'errors');
    console.error(`  Tour "${row.title}": ${e.message}`);
  }
}

console.log(`Tours: ${JSON.stringify(stats.tours)}\n`);

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 3: UPDATE ACTIVITIES WITH TRANSLATIONS
// ═══════════════════════════════════════════════════════════════════════════

initStat('activities');
console.log('═══ PHASE 3: Updating Activities ═══');

for (const row of activitiesRows) {
  try {
    const slug = row.slug || slugify(row.title);
    const galleries = activityGalleries
      .filter(g => g.activities_id === row.id)
      .map(g => toImg(g.image));

    const trans = activityTransMap[row.id] || {};
    const translations = {};
    for (const [lang, t] of Object.entries(trans)) {
      translations[lang] = {
        title:    t.title || '',
        shoulder: t.shoulder || '',
        content:  t.content || '',
      };
    }

    const updateDoc = {
      author_id:   parseInt(row.author_id) || 17,
      title:       row.title,
      shoulder:    row.shoulder || '',
      slug,
      content:     row.content || '',
      youtube_video: row.youtube_video || '',
      youtube_thumbnail: row.youtube_thumbnail || '',
      duration_days:   parseInt(row.days) || 1,
      duration_nights: parseInt(row.nights) || 0,
      min_people:  1,
      max_people:  parseInt(row.max_people) || 10,
      min_advance_reservations: parseInt(row.min_advance_reservations) || null,
      faqs:      objToArr(row.faqs),
      includes:  objToArr(row.includes),
      excludes:  objToArr(row.excludes),
      highlights:objToArr(row.highlights),
      itinerary: objToArr(row.itinerary),
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
      translations,
      status: parseInt(row.status) || 1,
      view:   parseInt(row.view)   || 0,
      updated_at: safeDate(row.updated_at) || new Date(),
    };

    const res = await db.collection('activities').updateOne(
      { slug },
      { $set: updateDoc, $setOnInsert: { created_at: safeDate(row.created_at) || new Date() } },
      { upsert: true }
    );
    if (res.upsertedCount) logResult('activities', 'inserted');
    else if (res.modifiedCount) logResult('activities', 'updated');
    else logResult('activities', 'skipped');
  } catch (e) {
    logResult('activities', 'errors');
    console.error(`  Activity "${row.title}": ${e.message}`);
  }
}

console.log(`Activities: ${JSON.stringify(stats.activities)}\n`);

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 4: UPDATE BLOGS WITH TRANSLATIONS & COMMENTS
// ═══════════════════════════════════════════════════════════════════════════

initStat('blogs');
console.log('═══ PHASE 4: Updating Blogs ═══');

for (const row of blogsRows) {
  try {
    const slug = row.slug || slugify(row.title);
    const cat  = blogCatMap[row.category_id];
    const tags = row.tags ? row.tags.split(',').map(t => t.trim()).filter(Boolean) : [];

    // Translations
    const trans = blogTransMap[row.id] || {};
    const translations = {};
    for (const [lang, t] of Object.entries(trans)) {
      translations[lang] = {
        title:       t.title || '',
        description: t.description || '',
      };
    }

    // Comments
    const comments = blogComments
      .filter(c => c.blog_id === row.id)
      .map(c => ({
        comment:    c.comment || '',
        status:     toInt(c.status, 1),
        created_at: safeDate(c.created_at) || new Date(),
      }));

    const updateDoc = {
      title:       row.title,
      slug,
      description: row.description || '',
      image:       toImg(row.image),
      category:    cat ? { name: cat.name, slug: cat.slug || slugify(cat.name) } : { name: '', slug: '' },
      tags,
      seo: {
        meta_title:       row.meta_title       || '',
        meta_keyward:     row.meta_keyward      || '',
        meta_description: row.meta_description  || '',
      },
      translations,
      comments,
      enable_seo: row.enable_seo === '1',
      status:     parseInt(row.status) || 1,
      updated_at: safeDate(row.updated_at) || new Date(),
    };

    const res = await db.collection('blogs').updateOne(
      { slug },
      { $set: updateDoc, $setOnInsert: { created_at: safeDate(row.created_at) || new Date() } },
      { upsert: true }
    );
    if (res.upsertedCount) logResult('blogs', 'inserted');
    else if (res.modifiedCount) logResult('blogs', 'updated');
    else logResult('blogs', 'skipped');
  } catch (e) {
    logResult('blogs', 'errors');
    console.error(`  Blog "${row.title}": ${e.message}`);
  }
}

console.log(`Blogs: ${JSON.stringify(stats.blogs)}\n`);

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 5: UPDATE TRANSPORTS WITH TRANSLATIONS
// ═══════════════════════════════════════════════════════════════════════════

initStat('transports');
console.log('═══ PHASE 5: Updating Transports ═══');

for (const row of transportsRows) {
  try {
    const slug = row.slug || slugify(row.title);
    const galleries = transportGalleries
      .filter(g => g.transport_id === row.id)
      .map(g => toImg(g.image));
    const cat = tCatMap[row.category_id];

    // Translations
    const trans = transportTransMap[row.id] || {};
    const translations = {};
    for (const [lang, t] of Object.entries(trans)) {
      translations[lang] = {
        title:    t.title || '',
        shoulder: t.shoulder || '',
        content:  t.content || '',
      };
    }

    const updateDoc = {
      author_id:  parseInt(row.author_id) || 17,
      title:      row.title,
      shoulder:   row.shoulder || '',
      slug,
      content:    row.content    || '',
      youtube_url:row.youtube_video || '',
      category:   cat ? { name: cat.name, slug: cat.slug || slugify(cat.name) } : { name: '', slug: '' },
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
      translations,
      status: parseInt(row.status) || 1,
      view:   parseInt(row.view)   || 0,
      updated_at: safeDate(row.updated_at) || new Date(),
    };

    const res = await db.collection('transports').updateOne(
      { slug },
      { $set: updateDoc, $setOnInsert: { created_at: safeDate(row.created_at) || new Date() } },
      { upsert: true }
    );
    if (res.upsertedCount) logResult('transports', 'inserted');
    else if (res.modifiedCount) logResult('transports', 'updated');
    else logResult('transports', 'skipped');
  } catch (e) {
    logResult('transports', 'errors');
    console.error(`  Transport "${row.title}": ${e.message}`);
  }
}

console.log(`Transports: ${JSON.stringify(stats.transports)}\n`);

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 6: UPDATE VISAS WITH TRANSLATIONS
// ═══════════════════════════════════════════════════════════════════════════

initStat('visas');
console.log('═══ PHASE 6: Updating Visas ═══');

for (const row of visasRows) {
  try {
    const slug = row.slug || slugify(row.title);
    const cat  = visaCatMap[row.category_id];

    // Translations
    const trans = visaTransMap[row.id] || {};
    const translations = {};
    for (const [lang, t] of Object.entries(trans)) {
      translations[lang] = {
        title:    t.title || '',
        includes: t.includes ? objToArr(t.includes) : undefined,
        faqs:     t.faqs ? objToArr(t.faqs) : undefined,
      };
    }

    const updateDoc = {
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
      translations,
      status: parseInt(row.status) || 1,
      updated_at: safeDate(row.updated_at) || new Date(),
    };

    const res = await db.collection('visas').updateOne(
      { slug },
      { $set: updateDoc, $setOnInsert: { created_at: safeDate(row.created_at) || new Date() } },
      { upsert: true }
    );
    if (res.upsertedCount) logResult('visas', 'inserted');
    else if (res.modifiedCount) logResult('visas', 'updated');
    else logResult('visas', 'skipped');
  } catch (e) {
    logResult('visas', 'errors');
    console.error(`  Visa "${row.title}": ${e.message}`);
  }
}

console.log(`Visas: ${JSON.stringify(stats.visas)}\n`);

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 7: CLEAN CONTACTS — REMOVE SPAM
// ═══════════════════════════════════════════════════════════════════════════

console.log('═══ PHASE 7: Cleaning Contacts ═══');

// Remove spam contacts
const spamResult = await db.collection('contacts').deleteMany({
  $or: [
    { message: { $regex: 'promotional offer', $options: 'i' } },
    { message: { $regex: 'novaai', $options: 'i' } },
    { message: { $regex: 'smartexperts', $options: 'i' } },
    { message: { $regex: 'MultiverseAI', $options: 'i' } },
    { message: { $regex: 'AISuperBOT', $options: 'i' } },
    { message: { $regex: 'CourseBeastAI', $options: 'i' } },
    { message: { $regex: 'AIScaleStack', $options: 'i' } },
    { message: { $regex: 'BookInADay', $options: 'i' } },
    { message: { $regex: 'PASSIVECLASS', $options: 'i' } },
    { subject: { $regex: 'promotional', $options: 'i' } },
    { message: { $regex: 'Relaying comments through', $options: 'i' } },
    { message: { $regex: 'Contact Forms are considered', $options: 'i' } },
    { message: { $regex: 'FeedbackFormEU', $options: 'i' } },
    { message: { $regex: 'submitted.*contact forms', $options: 'i' } },
  ]
});
console.log(`Removed ${spamResult.deletedCount} spam contacts`);

// Remove inquiry-typed contacts (legacy_id starts with inq_) since Contact model doesn't have inquiry fields
const inqResult = await db.collection('contacts').deleteMany({
  legacy_id: { $regex: '^inq_' }
});
console.log(`Removed ${inqResult.deletedCount} legacy inquiry contacts`);

console.log(`Contacts remaining: ${await db.collection('contacts').countDocuments()}\n`);

// ═══════════════════════════════════════════════════════════════════════════
// PHASE 8: SEED FUN FACTS
// ═══════════════════════════════════════════════════════════════════════════

console.log('═══ PHASE 8: Seeding Fun Facts ═══');

const existingFunFacts = await db.collection('funfacts').countDocuments();
if (existingFunFacts === 0) {
  const funFacts = [
    { number: '500', suffix: '+', label: 'Tours Completed', icon: 'bi-globe-americas', serial: 1, status: 1 },
    { number: '10', suffix: 'K+', label: 'Happy Customers', icon: 'bi-people', serial: 2, status: 1 },
    { number: '50', suffix: '+', label: 'Destinations', icon: 'bi-geo-alt', serial: 3, status: 1 },
    { number: '15', suffix: '+', label: 'Years Experience', icon: 'bi-award', serial: 4, status: 1 },
  ];
  const now = new Date();
  for (const f of funFacts) {
    await db.collection('funfacts').insertOne({ ...f, created_at: now, updated_at: now });
  }
  console.log(`Inserted ${funFacts.length} fun facts`);
} else {
  console.log(`Fun facts already exist (${existingFunFacts}), skipping`);
}

// ═══════════════════════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════════════════════

console.log('\n═══════════════════════════════════');
console.log('  Migration Complete — Summary');
console.log('═══════════════════════════════════');
for (const [name, s] of Object.entries(stats)) {
  console.log(
    `  ${name.padEnd(20)} inserted: ${String(s.inserted).padStart(5)}` +
    `  updated: ${String(s.updated).padStart(5)}` +
    `  skipped: ${String(s.skipped).padStart(5)}` +
    `  errors: ${String(s.errors).padStart(4)}`
  );
}

// Final counts
console.log('\n═══ Final Collection Counts ═══');
const colls = await db.listCollections().toArray();
for (const c of colls.sort((a,b) => a.name.localeCompare(b.name))) {
  const count = await db.collection(c.name).countDocuments();
  console.log(`  ${c.name.padEnd(25)} ${count}`);
}

console.log('\n═══════════════════════════════════\n');

await mongoose.disconnect();
