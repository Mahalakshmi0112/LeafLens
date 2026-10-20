const mongoose = require('mongoose');

function sanitizeMongoUri(uri) {
  if (!uri) return 'mongodb://<unset>';
  return uri.replace(/(mongodb(?:\+srv)?:\/\/)([^:@/]+):([^@/]+)@/i, '$1$2:[REDACTED]@');
}

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/leaflens';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB connected: ${mongoose.connection.name} at ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`MongoDB not reachable at ${sanitizeMongoUri(uri)}. Is mongod running?`);
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
