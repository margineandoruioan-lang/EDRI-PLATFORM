const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'EDRI Backend API functioneaza!',
    version: '1.0.0',
    status: 'online'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// MongoDB connection
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB conectat!'))
    .catch(err => console.log('MongoDB eroare:', err));
}

app.listen(PORT, () => {
  console.log(`EDRI Backend pornit pe portul ${PORT}`);
});
