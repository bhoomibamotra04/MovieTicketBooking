const express = require('express');
const router = express.Router();
const axios = require('axios');
const Booking = require('../models/Booking');
const { protect } = require('../middleware/auth');

const MOVIE_SERVICE = process.env.MOVIE_SERVICE_URL;

// POST /api/bookings — create a new booking
// Calls movie-service to validate showtime and lock seats
router.post('/', protect, async (req, res) => {
  try {
    const { showtimeId, seats } = req.body;

    // Call movie-service to get showtime data
    const { data: showtime } = await axios.get(`${MOVIE_SERVICE}/api/showtimes/${showtimeId}`);
    if (!showtime) return res.status(404).json({ message: 'Showtime not found' });

    // Check if any selected seat is already booked
    const seatNumbers = seats.map((s) => s.seatNumber);
    const alreadyBooked = showtime.seats.filter(
      (s) => seatNumbers.includes(s.seatNumber) && s.isBooked
    );
    if (alreadyBooked.length > 0)
      return res.status(409).json({ message: 'Some seats already booked', seats: alreadyBooked.map((s) => s.seatNumber) });

    // Lock seats in movie-service by updating each seat
    const updatedSeats = showtime.seats.map((s) =>
      seatNumbers.includes(s.seatNumber) ? { ...s, isBooked: true } : s
    );
    await axios.put(`${MOVIE_SERVICE}/api/showtimes/${showtimeId}/seats`, { seats: updatedSeats });

    const totalAmount = seats.reduce((sum, s) => sum + s.price, 0);

    const booking = await Booking.create({
      user: req.user.id,
      showtime: showtimeId,
      seats,
      totalAmount,
      status: 'pending',
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.response?.data?.message || err.message });
  }
});

// GET /api/bookings/my — get current user's bookings
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).sort({ createdAt: -1 });

    // Enrich each booking with showtime + movie data from movie-service
    const enriched = await Promise.all(
      bookings.map(async (b) => {
        try {
          const { data: showtime } = await axios.get(`${MOVIE_SERVICE}/api/showtimes/${b.showtime}`);
          return { ...b.toObject(), showtime };
        } catch {
          return b.toObject();
        }
      })
    );

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/bookings/:id — get single booking
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Get showtime details from movie-service
    const { data: showtime } = await axios.get(`${MOVIE_SERVICE}/api/showtimes/${booking.showtime}`);
    res.json({ ...booking.toObject(), showtime });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/bookings/:id/cancel — cancel booking and release seats
router.put('/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });
    if (booking.status === 'cancelled')
      return res.status(400).json({ message: 'Already cancelled' });

    // Release seats in movie-service
    const { data: showtime } = await axios.get(`${MOVIE_SERVICE}/api/showtimes/${booking.showtime}`);
    const seatNumbers = booking.seats.map((s) => s.seatNumber);
    const updatedSeats = showtime.seats.map((s) =>
      seatNumbers.includes(s.seatNumber) ? { ...s, isBooked: false } : s
    );
    await axios.put(`${MOVIE_SERVICE}/api/showtimes/${booking.showtime}/seats`, { seats: updatedSeats });

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/bookings/:id/confirm — called by payment-service after payment
router.put('/:id/confirm', async (req, res) => {
  try {
    const { paymentId } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'confirmed', paymentId },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
