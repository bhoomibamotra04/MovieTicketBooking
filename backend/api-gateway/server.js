/**
 * API GATEWAY — Port 5000
 * Single entry point for the frontend.
 * Routes all requests to the correct microservice.
 *
 * /api/auth/*      → auth-service    (port 3001)
 * /api/movies/*    → movie-service   (port 3002)
 * /api/showtimes/* → movie-service   (port 3002)
 * /api/bookings/*  → booking-service (port 3003)
 * /api/payments/*  → payment-service (port 3004)
 */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createProxyMiddleware } = require('http-proxy-middleware');

dotenv.config();

const app = express();
app.use(cors());

// Route: Auth Service
app.use('/api/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL,
  changeOrigin: true,
  on: { error: (err, req, res) => res.status(503).json({ message: 'Auth service unavailable' }) },
}));

// Route: Movie Service (movies + showtimes)
app.use('/api/movies', createProxyMiddleware({
  target: process.env.MOVIE_SERVICE_URL,
  changeOrigin: true,
  on: { error: (err, req, res) => res.status(503).json({ message: 'Movie service unavailable' }) },
}));

app.use('/api/showtimes', createProxyMiddleware({
  target: process.env.MOVIE_SERVICE_URL,
  changeOrigin: true,
  on: { error: (err, req, res) => res.status(503).json({ message: 'Movie service unavailable' }) },
}));

// Route: Booking Service
app.use('/api/bookings', createProxyMiddleware({
  target: process.env.BOOKING_SERVICE_URL,
  changeOrigin: true,
  on: { error: (err, req, res) => res.status(503).json({ message: 'Booking service unavailable' }) },
}));

// Route: Payment Service
app.use('/api/payments', createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE_URL,
  changeOrigin: true,
  on: { error: (err, req, res) => res.status(503).json({ message: 'Payment service unavailable' }) },
}));

// Gateway health check — shows status of all services
app.get('/health', (req, res) => {
  res.json({
    gateway: 'running',
    services: {
      auth:    process.env.AUTH_SERVICE_URL,
      movies:  process.env.MOVIE_SERVICE_URL,
      booking: process.env.BOOKING_SERVICE_URL,
      payment: process.env.PAYMENT_SERVICE_URL,
    },
  });
});

app.listen(process.env.PORT, () =>
  console.log(`[api-gateway] Running on port ${process.env.PORT}`)
);
