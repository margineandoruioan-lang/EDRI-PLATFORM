const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Prea multe cereri. Încearcă din nou în 15 minute.' }
});
app.use('/api/', limiter);

app.use('/api/health',  require('./routes/health'));
app.use('/api/zscore',  require('./routes/zscore'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/search',  require('./routes/search'));

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ EDRI Backend running on port ${PORT}`);
  console.log(`🔍 Search API: ${process.env.OPENAPI_RO_KEY ? 'configurat' : '⚠️ LIPSĂ OPENAPI_RO_KEY'}`);
});

module.exports = app;
