const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/movies — list all active movies with optional filters
router.get('/', async (req, res) => {
  try {
    const { genre, language, search } = req.query;
    const filter = { isActive: true };
    if (genre)  filter.genre = genre;
    if (language) filter.language = language;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const movies = await Movie.find(filter).sort({ createdAt: -1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/movies/:id — get single movie
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/movies — create movie (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/movies/:id — update movie (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/movies/:id — soft delete (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Movie.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Movie removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
