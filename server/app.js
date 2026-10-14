require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const predictRoutes = require('./routes/predictRoutes');
const scanRoutes = require('./routes/scanRoutes');
const statsRoutes = require('./routes/statsRoutes');
const healthRoutes = require('./routes/healthRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: clientOrigin, methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: 'Too many requests. Please try again later.' } }));
app.use('/api/predict', rateLimit({ windowMs: 60 * 1000, limit: 20, standardHeaders: 'draft-7', legacyHeaders: false, message: { message: 'Prediction limit reached. Please wait a minute before retrying.' } }));

app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/health', healthRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
