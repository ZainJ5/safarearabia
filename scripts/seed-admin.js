/**
 * Admin Seed Script
 * Run: node scripts/seed-admin.js
 * 
 * Creates or updates the admin user in MongoDB.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load env
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env.local');
  process.exit(1);
}

const UserSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  phone: String,
  address: String,
  image: String,
  role: Number,
  status: Number,
  email_verified_at: Date,
  wallet_balance: Number,
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const User = mongoose.models.User || mongoose.model('User', UserSchema);

    const hashedPassword = await bcrypt.hash('admin123456', 12);

    const admin = await User.findOneAndUpdate(
      { email: 'admin@gmail.com' },
      {
        $set: {
          fname: 'MUHAMMAD',
          lname: 'AYAN',
          password: hashedPassword,
          phone: '+92 305 1309051',
          address: 'LG-111 Siddique Trade Center Main Boulevard Lahore',
          role: 1,
          status: 1,
          email_verified_at: new Date(),
          wallet_balance: 0,
        },
      },
      { upsert: true, new: true }
    );

    console.log('✅ Admin user seeded successfully!');
    console.log('   Email:    admin@gmail.com');
    console.log('   Password: admin123456');
    console.log('   Role:     1 (Admin)');
    console.log('   ID:       ' + admin._id);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
