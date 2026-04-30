import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import styles from './BookingHistory.module.css';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/bookings/my')
      .then(({ data }) => setBookings(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking? This cannot be undone.')) return;
    try {
      await api.put(`/bookings/${id}/cancel`);
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, status: 'cancelled' } : b));
      toast.success('Booking cancelled');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (loading) return <p className={styles.loading}>Loading bookings...</p>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>My Bookings</h2>
          <span className={styles.count}>{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</span>
        </div>

        {bookings.length === 0 ? (
          <div className={styles.empty}>
            <p>🎬 No bookings yet</p>
            <button className={styles.browseBtn} onClick={() => navigate('/')}>Browse Movies</button>
          </div>
        ) : (
          <div className={styles.list}>
            {bookings.map((b) => {
              const movie = b.showtime?.movie;
              const st = b.showtime;
              return (
                <div key={b._id} className={`${styles.card} ${b.status === 'cancelled' ? styles.cancelled : ''}`}>
                  <img src={movie?.posterUrl || 'https://via.placeholder.com/80x110?text=N/A'} alt="" className={styles.poster} />
                  <div className={styles.body}>
                    <div className={styles.info}>
                      <h3>{movie?.title}</h3>
                      <p>🏛️ {st?.theater} • {st?.screen}</p>
                      <p>📅 {st?.date} • {st?.startTime}</p>
                      <p className={styles.seats}>🪑 {b.seats.map((s) => s.seatNumber).join(', ')}</p>
                    </div>
                    <div className={styles.right}>
                      <span className={styles.amount}>₹{b.totalAmount}</span>
                      <span className={`${styles.badge} ${styles[b.status]}`}>{b.status.toUpperCase()}</span>
                      <div className={styles.actions}>
                        <button className={styles.viewBtn} onClick={() => navigate(`/booking/${b._id}/confirmation`)}>View</button>
                        {b.status === 'confirmed' && (
                          <button className={styles.cancelBtn} onClick={() => handleCancel(b._id)}>Cancel</button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
