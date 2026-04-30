const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');
const crypto = require('crypto');

// POST /api/payments - process payment for a booking
router.post('/', protect, async (req, res) => {
  try {
    const { bookingId, method } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status === 'confirmed')
      return res.status(400).json({ message: 'Already paid' });

    // Mock payment - always succeeds
    const transactionId = crypto.randomBytes(12).toString('hex').toUpperCase();

    const payment = await Payment.create({
      booking: bookingId,
      user: req.user._id,
      amount: booking.totalAmount,
      method: method || 'card',
      status: 'success',
      transactionId,
    });

    // Confirm booking
    booking.status = 'confirmed';
    booking.paymentId = transactionId;
    await booking.save();

    res.status(201).json({ payment, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/payments/:bookingId
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
