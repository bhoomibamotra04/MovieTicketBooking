import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import SeatMap from '../components/SeatMap';
import styles from './SeatSelection.module.css';

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  useEffect(() => {
    api.get(`/showtimes/${id}`).then(({ data }) => setShowtime(data)).catch(console.error);
  }, [id]);

  const handleSeatClick = (seat) => {
    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.seatNumber === seat.seatNumber);
      if (exists) return prev.filter((s) => s.seatNumber !== seat.seatNumber);
      if (prev.length >= 8) return prev;
      return [...prev, seat];
    });
  };

  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  if (!showtime) return <p className={styles.loading}>Loading seats...</p>;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
        <div className={styles.headerInfo}>
          <h3>{showtime.movie?.title}</h3>
          <p>{showtime.theater} • {showtime.screen} • {showtime.date} • {showtime.startTime}</p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.seatArea}>
          <SeatMap seats={showtime.seats} selectedSeats={selectedSeats} onSeatClick={handleSeatClick} />
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.selectedInfo}>
          <p>{selectedSeats.length} seat(s) selected (max 8)</p>
          <p className={styles.selectedSeats}>{selectedSeats.map((s) => s.seatNumber).join(', ') || '—'}</p>
        </div>
        <div style={{textAlign:'right'}}>
          <div className={styles.totalAmount}>₹{totalAmount}</div>
        </div>
        <button
          className={styles.proceedBtn}
          disabled={selectedSeats.length === 0}
          onClick={() => navigate('/checkout', { state: { showtime, selectedSeats, totalAmount } })}
        >
          Proceed →
        </button>
      </div>
    </div>
  );
}
