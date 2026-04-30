/**
 * AUTH SERVICE — Port 3001
 * Handles: user registration, login, JWT token generation & verification
 */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// Health check
app.get('/health', (req, res) => res.json({ service: 'auth-service', status: 'running' }));

// Error handler
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('[auth-service] MongoDB connected');
  app.listen(process.env.PORT, () =>
    console.log(`[auth-service] Running on port ${process.env.PORT}`)
  );
}).catch(console.error);
