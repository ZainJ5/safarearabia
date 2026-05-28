import mongoose from 'mongoose';
import dbConnect from '../src/lib/dbConnect.js';
import User from '../src/models/User.js';
import Tour from '../src/models/Tour.js';
// other models

async function seed() {
  await dbConnect();
  console.log('Connected to MongoDB.');
  
  // Example dummy data seeding script that would parse SQL dumps or seed initial data
  // try {
  //   await User.deleteMany({});
  //   console.log('Cleared existing users');
  //   
  //   const admin = await User.create({
  //     fname: 'Admin',
  //     lname: 'User',
  //     email: 'admin@safarearabiantravel.com',
  //     password: 'hashedpassword',
  //     role: 1,
  //     status: 1
  //   });
  //   console.log('Admin user created');
  // } catch (err) {
  //   console.error(err);
  // }

  console.log('Seeding procedure prepared for SQL parsing. Execution complete.');
  process.exit(0);
}

seed();
