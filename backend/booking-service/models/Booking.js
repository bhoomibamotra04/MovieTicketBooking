const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, required: true }, // from auth-service
    showtime:    { type: mongoose.Schema.Types.ObjectId, required: true }, // from movie-service
    seats: [
      {
        seatNumber: String,
        row:        String,
        type:       String,
        price:      Number,
      },
    ],
    totalAmount: { type: Number, required: true },
    status:      { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    paymentId:   { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
