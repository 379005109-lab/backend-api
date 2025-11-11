require('dotenv').config();
const mongoose = require('mongoose');
const MaterialCategory = require('./models/MaterialCategory');

async function init() {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database connected');

    const count = await MaterialCategory.countDocuments();
    console.log('Current count:', count);

    if (count > 0) {
      await MaterialCategory.deleteMany({});
      console.log('Cleared existing data');
    }

    const cats = [
      { name: 'Wood', parentId: null, order: 1 },
      { name: 'Stone', parentId: null, order: 2 },
      { name: 'Metal', parentId: null, order: 3 },
      { name: 'Fabric', parentId: null, order: 4 },
      { name: 'Leather', parentId: null, order: 5 },
      { name: 'Glass', parentId: null, order: 6 }
    ];

    const created = await MaterialCategory.insertMany(cats);
    console.log('Created categories:', created.length);
    
    created.forEach((c, i) => {
      console.log(i+1, c.name, c._id);
    });

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

init();
