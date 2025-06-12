const express = require('express');
const cors = require('cors');
const { db, initializeDatabase } = require('./db');
const userRoutes = require('./routes/users');
const profilRoutes = require('./routes/profil');
const riwayatRoutes = require('./routes/riwayat');

const app = express();

// Middleware untuk CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware untuk parsing body
app.use(express.json({
  limit: '50mb'
}));

app.use(express.urlencoded({
  extended: true,
  limit: '50mb'
}));

// Middleware untuk logging (optional, bisa dicomment untuk production)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/', async (req, res) => {
  try {
    // Test database connection
    await initializeDatabase();
    res.json({ 
      message: 'API is running!', 
      timestamp: new Date().toISOString(),
      status: 'healthy'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      error: 'Database connection failed', 
      message: error.message 
    });
  }
});

// Middleware untuk inisialisasi database di setiap API call
app.use('/api', async (req, res, next) => {
  try {
    await initializeDatabase();
    next();
  } catch (error) {
    console.error('Database initialization failed:', error);
    res.status(500).json({ 
      error: 'Database connection failed', 
      message: error.message 
    });
  }
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/profil', profilRoutes);
app.use('/api/riwayat', riwayatRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Export untuk Vercel (WAJIB untuk serverless)
module.exports = app;