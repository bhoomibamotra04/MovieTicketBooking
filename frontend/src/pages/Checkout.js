import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import styles from './Checkout.module.css';

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);

  if (!state) return <p className={styles.loading}>No booking data.</p>;
  const { showtime, selectedSeats, totalAmount } = state;

  const handlePayment = async () => {
    setLoading(true);
    try {
      const { data: booking } = await api.post('/bookings', { showtimeId: showtime._id, seats: selectedSeats });
      await api.post('/payments', { bookingId: booking._id, method });
      toast.success('🎉 Booking confirmed!');
      navigate(`/booking/${booking._id}/confirmation`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  const convenience = Math.round(totalAmount * 0.05);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>🎟️ Complete Booking</h2>
        <div className={styles.grid}>

          {/* Order Summary */}
          <div className={styles.card}>
            <p className={styles.cardTitle}>📋 Order Summary</p>
            <div className={styles.movieRow}>
              <img src={showtime.movie?.posterUrl || 'https://via.placeholder.com/60x85'} alt="" className={styles.poster} />
              <div className={styles.movieInfo}>
                <h4>{showtime.movie?.title}</h4>
                <p>🏛️ {showtime.theater}</p>
                <p>📅 {showtime.date} • {showtime.startTime}</p>
                <p>🎭 {showtime.screen}</p>
              </div>
            </div>
            <hr className={styles.divider} />
            <div>
              <p style={{fontSize:'0.8rem',color:'#888',marginBottom:'0.4rem'}}>Selected Seats</p>
              {selectedSeats.map((s) => (
                <span key={s.seatNumber} className={styles.seatChip}>{s.seatNumber} ({s.type})</span>
              ))}
            </div>
            <hr className={styles.divider} />
            <div className={styles.row}><span>Subtotal</span><span>₹{totalAmount}</span></div>
            <div className={styles.row}><span>Convenience Fee</span><span>₹{convenience}</span></div>
            <div className={styles.totalRow}><span>Total</span><span>₹{totalAmount + convenience}</span></div>
          </div>

          {/* Payment */}
          <div className={styles.card}>
            <p className={styles.cardTitle}>💳 Payment Method</p>
            <div className={styles.methods}>
              {[
                { id: 'card', label: '💳 Credit / Debit Card' },
                { id: 'upi', label: '📱 UPI' },
                { id: 'netbanking', label: '🏦 Net Banking' },
              ].map((m) => (
                <label key={m.id} className={`${styles.method} ${method === m.id ? styles.selected : ''}`}>
                  <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} />
                  {m.label}
                </label>
              ))}
            </div>

            {method === 'card' && (
              <div className={styles.cardForm}>
                <input className={styles.input} placeholder="Card Number" maxLength={19} />
                <div className={styles.inputRow}>
                  <input className={styles.input} placeholder="MM / YY" />
                  <input className={styles.input} placeholder="CVV" maxLength={3} />
                </div>
                <input className={styles.input} placeholder="Name on Card" />
              </div>
            )}
            {method === 'upi' && (
              <div className={styles.cardForm}>
                <input className={styles.input} placeholder="Enter UPI ID (e.g. name@upi)" />
              </div>
            )}

            <button className={styles.payBtn} onClick={handlePayment} disabled={loading}>
              {loading ? 'Processing...' : `Pay ₹${totalAmount + convenience}`}
            </button>
            <p className={styles.note}>🔒 Secure payment • Demo mode — no real charge</p>
          </div>
        </div>
      </div>
    </div>
  );
}
