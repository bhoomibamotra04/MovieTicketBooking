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
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upi, setUpi] = useState('');

  if (!state) return <p className={styles.loading}>No booking data.</p>;
  const { showtime, selectedSeats, totalAmount } = state;

  const handlePayment = async () => {
    if (method === 'card') {
      const numStripped = card.number.replace(/\s+/g, '');
      if (!/^\d{16}$/.test(numStripped)) return toast.error('Credit card number must be exactly 16 digits');
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) return toast.error('Expiry must be MM/YY');
      if (!/^\d{3,4}$/.test(card.cvv)) return toast.error('CVV must be 3 or 4 digits');
      if (!card.name.trim()) return toast.error('Name on card is required');
    }
    if (method === 'upi' && !/^[a-zA-Z0-9.\-_]+@[a-zA-Z]+$/.test(upi)) {
      return toast.error('Invalid UPI ID');
    }

    setLoading(true);
    try {
      const { data: booking } = await api.post('/bookings', { showtimeId: showtime._id, seats: selectedSeats });
      await api.post('/payments', { bookingId: booking._id, method, amount: totalAmount + convenience });
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
              <img src={showtime.movie?.posterUrl || 'https://via.placeholder.com/60x85?text=No+Poster'} alt="" className={styles.poster} onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/60x85?text=No+Poster'; }} />
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
                <input className={styles.input} placeholder="Card Number (16 digits)" maxLength={19} value={card.number} onChange={(e) => setCard({...card, number: e.target.value})} />
                <div className={styles.inputRow}>
                  <input className={styles.input} placeholder="MM/YY" maxLength={5} value={card.expiry} onChange={(e) => setCard({...card, expiry: e.target.value})} />
                  <input className={styles.input} placeholder="CVV" maxLength={4} value={card.cvv} onChange={(e) => setCard({...card, cvv: e.target.value})} />
                </div>
                <input className={styles.input} placeholder="Name on Card" value={card.name} onChange={(e) => setCard({...card, name: e.target.value})} />
              </div>
            )}
            {method === 'upi' && (
              <div className={styles.cardForm}>
                <input className={styles.input} placeholder="Enter UPI ID (e.g. name@upi)" value={upi} onChange={(e) => setUpi(e.target.value)} />
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
