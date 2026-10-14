
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

async function start() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error(
      'JWT_SECRET is missing or too short. Set a random secret of at least 32 characters in server/.env.'
    );
    process.exit(1);
  }

  await connectDB();

  const PORT = Number(process.env.PORT) || 5001;

  app.listen(PORT, '127.0.0.1', () => {
    console.log(
      `LeafLens Express API listening at http://127.0.0.1:${PORT}`
    );
  });
}

start();

