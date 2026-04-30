const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    genre: [{ type: String }],
    duration: { type: Number, required: true }, // in minutes
    language: { type: String, default: 'English' },
    rating: { type: Number, min: 0, max: 10, default: 0 },
    posterUrl: { type: String },
    cast: [{ type: String }],
    director: { type: String },
    releaseDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
