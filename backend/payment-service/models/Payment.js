const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    booking:       { type: mongoose.Schema.Types.ObjectId, required: true },
    user:          { type: mongoose.Schema.Types.ObjectId, required: true },
    amount:        { type: Number, required: true },
    method:        { type: String, enum: ['card', 'upi', 'netbanking'], default: 'card' },
    status:        { type: String, enum: ['success', 'failed', 'refunded'], default: 'success' },
    transactionId: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
