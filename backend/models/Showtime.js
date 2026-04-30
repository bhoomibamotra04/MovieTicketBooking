const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  row: { type: String, required: true },
  type: { type: String, enum: ['regular', 'premium', 'vip'], default: 'regular' },
  price: { type: Number, required: true },
  isBooked: { type: Boolean, default: false },
});

const showtimeSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theater: { type: String, required: true },
    screen: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    startTime: { type: String, required: true }, // HH:MM
    endTime: { type: String, required: true },
    seats: [seatSchema],
    regularPrice: { type: Number, required: true },
    premiumPrice: { type: Number, required: true },
    vipPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

// Auto-generate seats before saving a new showtime
showtimeSchema.pre('save', function (next) {
  if (this.isNew && this.seats.length === 0) {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 10;
    const seats = [];
    rows.forEach((row, rowIndex) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        let type = 'regular';
        let price = this.regularPrice;
        if (rowIndex >= 6) { type = 'vip'; price = this.vipPrice; }
        else if (rowIndex >= 4) { type = 'premium'; price = this.premiumPrice; }
        seats.push({ seatNumber: `${row}${i}`, row, type, price, isBooked: false });
      }
    });
    this.seats = seats;
  }
  next();
});

module.exports = mongoose.model('Showtime', showtimeSchema);
