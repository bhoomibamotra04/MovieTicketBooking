const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const { protect } = require('../middleware/auth');

// POST /api/bookings - create booking
router.post('/', protect, async (req, res) => {
  try {
    const { showtimeId, seats } = req.body;

    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) return res.status(404).json({ message: 'Showtime not found' });

    // Check if any selected seat is already booked
    const seatNumbers = seats.map((s) => s.seatNumber);
    const alreadyBooked = showtime.seats.filter(
      (s) => seatNumbers.includes(s.seatNumber) && s.isBooked
    );
    if (alreadyBooked.length > 0)
      return res.status(409).json({ message: 'Some seats are already booked', seats: alreadyBooked.map((s) => s.seatNumber) });

    // Mark seats as booked
    showtime.seats.forEach((s) => {
      if (seatNumbers.includes(s.seatNumber)) s.isBooked = true;
    });
    await showtime.save();

    const totalAmount = seats.reduce((sum, s) => sum + s.price, 0);

    const booking = await Booking.create({
      user: req.user._id,
      showtime: showtimeId,
      seats,
      totalAmount,
      status: 'pending',
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bookings/my - get current user's bookings
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({ path: 'showtime', populate: { path: 'movie', select: 'title posterUrl' } })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bookings/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({ path: 'showtime', populate: { path: 'movie' } })
      .populate('user', 'name email');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/bookings/:id/cancel
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    if (booking.status === 'cancelled')
      return res.status(400).json({ message: 'Already cancelled' });

    // Release seats
    const showtime = await Showtime.findById(booking.showtime);
    const seatNumbers = booking.seats.map((s) => s.seatNumber);
    showtime.seats.forEach((s) => {
      if (seatNumbers.includes(s.seatNumber)) s.isBooked = false;
    });
    await showtime.save();

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
