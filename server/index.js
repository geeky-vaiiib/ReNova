require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
// CORS configuration
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const allowedOrigins = [
  // Development origins
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3003",
  "http://localhost:5173",
  // Production origins
  "https://renova.vercel.app",
  "https://renova-marketplace.vercel.app",
  FRONTEND_URL
].filter(Boolean);

console.log('🌐 CORS allowed origins:', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Set-Cookie']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing middleware
app.use(cookieParser());

// Root route for Render health checks
app.get('/', (_req, res) => res.send('ReNova API is running ✅'));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'ReNova API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    port: PORT
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.details
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token',
      message: 'Please provide a valid authentication token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired',
      message: 'Your session has expired. Please login again'
    });
  }
  
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// Start server
const startServer = async () => {
  try {
    console.log('🔄 Starting ReNova API server...');
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔌 Port: ${PORT}`);
    console.log(`🌐 CORS Origins: ${allowedOrigins.join(', ')}`);

    // Test database connection
    console.log('🔄 Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    // Run migrations and seeds automatically
    if (process.env.NODE_ENV === 'production') {
      console.log('🔄 Running database migrations...');
      try {
        const { exec } = require('child_process');
        const { promisify } = require('util');
        const execAsync = promisify(exec);

        // Run migrations with detailed output
        console.log('🔄 Executing: npx sequelize-cli db:migrate');
        const { stdout: migrateOut, stderr: migrateErr } = await execAsync('npx sequelize-cli db:migrate', {
          cwd: __dirname,
          env: { ...process.env, NODE_ENV: 'production' }
        });

        if (migrateOut) console.log('📄 Migration stdout:', migrateOut);
        if (migrateErr) console.log('📄 Migration stderr:', migrateErr);
        console.log('✅ Database migrations completed');

        // Run seeds with detailed output
        console.log('🔄 Executing: npx sequelize-cli db:seed:all');
        const { stdout: seedOut, stderr: seedErr } = await execAsync('npx sequelize-cli db:seed:all', {
          cwd: __dirname,
          env: { ...process.env, NODE_ENV: 'production' }
        });

        if (seedOut) console.log('📄 Seed stdout:', seedOut);
        if (seedErr) console.log('📄 Seed stderr:', seedErr);
        console.log('✅ Database seeds completed');

      } catch (migrationError) {
        console.error('❌ Migration/Seed error details:');
        console.error('   Error message:', migrationError.message);
        console.error('   Error code:', migrationError.code);
        if (migrationError.stdout) console.error('   Stdout:', migrationError.stdout);
        if (migrationError.stderr) console.error('   Stderr:', migrationError.stderr);

        // Try to sync database as fallback
        console.log('🔄 Attempting database sync as fallback...');
        try {
          await sequelize.sync({ force: false, alter: false });
          console.log('✅ Database sync completed as fallback');
        } catch (syncError) {
          console.error('❌ Database sync also failed:', syncError.message);
        }
      }
    } else {
      // Sync database (in development only)
      await sequelize.sync({ alter: false });
      console.log('✅ Database synchronized');
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 ReNova API server running on port ${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 Root endpoint: http://localhost:${PORT}/`);
      console.log('✅ Server is ready to accept connections');
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error.message);
    console.error('❌ Full error:', error);

    if (error.name === 'SequelizeConnectionError') {
      console.error('❌ Database connection failed. Please check:');
      console.error('   - DATABASE_URL environment variable is set');
      console.error('   - PostgreSQL database is accessible');
      console.error('   - Database credentials are correct');
    }

    process.exit(1);
  }
};

startServer();

module.exports = app;
