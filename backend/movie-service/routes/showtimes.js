const express = require('express');
const router = express.Router();
const Showtime = require('../models/Showtime');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/showtimes?movieId=&date= — list showtimes with filters
router.get('/', async (req, res) => {
  try {
    const { movieId, date } = req.query;
    const filter = {};
    if (movieId) filter.movie = movieId;
    if (date)    filter.date  = date;

    const showtimes = await Showtime.find(filter).populate('movie', 'title duration posterUrl');
    res.json(showtimes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/showtimes/:id — get showtime with full seat data
router.get('/:id', async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id).populate('movie');
    if (!showtime) return res.status(404).json({ message: 'Showtime not found' });
    res.json(showtime);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/showtimes — create showtime (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const showtime = await Showtime.create(req.body);
    res.status(201).json(showtime);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/showtimes/:id — update showtime (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const showtime = await Showtime.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!showtime) return res.status(404).json({ message: 'Showtime not found' });
    res.json(showtime);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/showtimes/:id/seats — update showtime seats (internal call)
router.put('/:id/seats', async (req, res) => {
  try {
    const showtime = await Showtime.findByIdAndUpdate(
      req.params.id,
      { seats: req.body.seats },
      { new: true }
    );
    if (!showtime) return res.status(404).json({ message: 'Showtime not found' });
    res.json(showtime);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/showtimes/:id (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Showtime.findByIdAndDelete(req.params.id);
    res.json({ message: 'Showtime deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
