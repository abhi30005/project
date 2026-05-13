const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env variables
dotenv.config();

const app = express();

// Connect MongoDB
connectDB()
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
  });

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/predictionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Backend Running Successfully'
  });
});

// Health route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);

  res.status(500).json({
    message: 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});