const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
const env = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';
const MONGO_URI = env.split(/\r?\n/).find(l => l.startsWith('MONGO_URI='))?.split('=')[1];

if (!MONGO_URI) {
  console.error('MONGO_URI not found');
  process.exit(1);
}

(async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const User = require('./models/user');
    const users = await User.find({}).select('firstName lastName email accountType courses').lean();
    console.log(JSON.stringify(users, null, 2));
    await mongoose.disconnect();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
