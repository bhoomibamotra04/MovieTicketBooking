/**
 * PAYMENT SERVICE — Port 3004
 * Handles: payment processing (mock), transaction records
 * Communicates with: booking-service (confirm booking after payment)
 */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/payments', require('./routes/payments'));

app.get('/health', (req, res) => res.json({ service: 'payment-service', status: 'running' }));

app.use((err, req, res, next) => res.status(500).json({ message: err.message }));

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('[payment-service] MongoDB connected');
  app.listen(process.env.PORT, () =>
    console.log(`[payment-service] Running on port ${process.env.PORT}`)
  );
}).catch(console.error);
