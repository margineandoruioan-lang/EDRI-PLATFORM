const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 10000;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Prea multe cereri. Încearcă din nou în 15 minute.' }
});
app.use('/api/', limiter);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', project: 'EDRI', timestamp: new Date().toISOString() });
});

app.get('/api/decisions', (req, res) => {
  res.json({ decisions: [], message: 'EDRI Backend live' });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅ EDRI Backend running on port ${PORT}`);
});
