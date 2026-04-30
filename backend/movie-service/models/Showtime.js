const mongoose = require('mongoose');

// Individual seat schema
const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  row:        { type: String, required: true },
  type:       { type: String, enum: ['regular', 'premium', 'vip'], default: 'regular' },
  price:      { type: Number, required: true },
  isBooked:   { type: Boolean, default: false },
});

const showtimeSchema = new mongoose.Schema(
  {
    movie:        { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theater:      { type: String, required: true },
    screen:       { type: String, required: true },
    date:         { type: String, required: true },   // YYYY-MM-DD
    startTime:    { type: String, required: true },   // HH:MM
    endTime:      { type: String, required: true },
    seats:        [seatSchema],
    regularPrice: { type: Number, required: true },
    premiumPrice: { type: Number, required: true },
    vipPrice:     { type: Number, required: true },
  },
  { timestamps: true }
);

// Auto-generate seats when a new showtime is created
showtimeSchema.pre('save', function (next) {
  if (this.isNew && this.seats.length === 0) {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seats = [];
    rows.forEach((row, i) => {
      for (let n = 1; n <= 10; n++) {
        let type = 'regular', price = this.regularPrice;
        if (i >= 6) { type = 'vip';     price = this.vipPrice; }
        else if (i >= 4) { type = 'premium'; price = this.premiumPrice; }
        seats.push({ seatNumber: `${row}${n}`, row, type, price, isBooked: false });
      }
    });
    this.seats = seats;
  }
  next();
});

module.exports = mongoose.model('Showtime', showtimeSchema);
