/**
 * BOOKING SERVICE — Port 3003
 * Handles: seat booking, booking history, cancellations
 * Communicates with: movie-service (validate showtime, lock/release seats)
 */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/bookings', require('./routes/bookings'));

app.get('/health', (req, res) => res.json({ service: 'booking-service', status: 'running' }));

app.use((err, req, res, next) => res.status(500).json({ message: err.message }));

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('[booking-service] MongoDB connected');
  app.listen(process.env.PORT, () =>
    console.log(`[booking-service] Running on port ${process.env.PORT}`)
  );
}).catch(console.error);
