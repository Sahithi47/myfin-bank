require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const generateId = require('./utils/idGenerator');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const existing = await Admin.findOne({ email: 'admin@myfin.com' });
    if (existing) {
      console.log('✅ Admin already exists! You can login with:');
      console.log('   Email    : admin@myfin.com');
      console.log('   Password : Admin@123');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('Admin@123', 10);
    const adminId = await generateId(Admin, 'adminId', 'MYFIN-ADMIN');

    await Admin.create({
      adminId,
      name: 'Super Admin',
      email: 'admin@myfin.com',
      password: hashedPassword
    });

    console.log('✅ Admin created successfully!');
    console.log('   Email    : admin@myfin.com');
    console.log('   Password : Admin@123');
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

seedAdmin();