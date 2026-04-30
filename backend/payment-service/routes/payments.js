const express = require('express');
const router = express.Router();
const axios = require('axios');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const { protect } = require('../middleware/auth');

const BOOKING_SERVICE = process.env.BOOKING_SERVICE_URL;

// POST /api/payments — process payment for a booking
// After success, calls booking-service to confirm the booking
router.post('/', protect, async (req, res) => {
  try {
    const { bookingId, method, amount } = req.body;

    // Generate a mock transaction ID
    const transactionId = crypto.randomBytes(12).toString('hex').toUpperCase();

    // Save payment record
    const payment = await Payment.create({
      booking: bookingId,
      user: req.user.id,
      amount,
      method: method || 'card',
      status: 'success',
      transactionId,
    });

    // Notify booking-service to confirm the booking
    await axios.put(`${BOOKING_SERVICE}/api/bookings/${bookingId}/confirm`, {
      paymentId: transactionId,
    });

    res.status(201).json({ payment, transactionId });
  } catch (err) {
    res.status(500).json({ message: err.response?.data?.message || err.message });
  }
});

// GET /api/payments/:bookingId — get payment for a booking
router.get('/:bookingId', protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({ booking: req.params.bookingId });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
