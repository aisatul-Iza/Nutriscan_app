const express = require('express');
const cors = require('cors');
const { db, initializeDatabase } = require('./db');
const userRoutes = require('./routes/users');
const profilRoutes = require('./routes/profil');
const riwayatRoutes = require('./routes/riwayat');

const app = express();
const PORT = 5000;

// Middleware untuk CORS dulu
app.use(cors({
  origin: '*', // atau spesifik ke frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware untuk parsing body dengan limit yang lebih besar
app.use(express.json({ 
  limit: '50mb',
  verify: (req, res, buf) => {
    console.log('=== RAW BODY RECEIVED ===');
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Body length:', buf.length);
    console.log('Body preview:', buf.toString().substring(0, 200) + '...');
  }
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '50mb' 
}));

// Middleware untuk logging semua request
app.use((req, res, next) => {
  console.log(`\n=== ${new Date().toISOString()} ===`);
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/profil', profilRoutes);
app.use('/api/riwayat', riwayatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('=== SERVER ERROR ===');
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

module.exports = app;