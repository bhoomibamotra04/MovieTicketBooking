import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import styles from './BookingConfirmation.module.css';

export default function BookingConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    api.get(`/bookings/${id}`).then(({ data }) => setBooking(data)).catch(console.error);
  }, [id]);

  if (!booking) return <p className={styles.loading}>Loading...</p>;

  const movie = booking.showtime?.movie;
  const st = booking.showtime;

  return (
    <div className={styles.page}>
      <div className={styles.ticket}>
        <div className={styles.ticketTop}>
          <div className={styles.checkIcon}>✅</div>
          <h2>Booking Confirmed!</h2>
          <p>Your tickets are ready. Enjoy the show!</p>
        </div>

        <div className={styles.ticketBody}>
          <div className={styles.bookingId}>
            <span>Booking ID</span>
            <span>{booking._id?.slice(-12).toUpperCase()}</span>
          </div>

          <div className={styles.row}><span>Movie</span><span>{movie?.title}</span></div>
          <div className={styles.row}><span>Theater</span><span>{st?.theater}</span></div>
          <div className={styles.row}><span>Screen</span><span>{st?.screen}</span></div>
          <div className={styles.row}><span>Date</span><span>{st?.date}</span></div>
          <div className={styles.row}><span>Time</span><span>{st?.startTime}</span></div>
          <div className={styles.row}><span>Seats</span><span>{booking.seats.map((s) => s.seatNumber).join(', ')}</span></div>

          <hr className={styles.divider} />

          <div className={styles.row}><span>Amount Paid</span><span style={{color:'#2ecc71',fontWeight:700}}>₹{booking.totalAmount}</span></div>
          {booking.paymentId && <div className={styles.row}><span>Transaction ID</span><span style={{fontFamily:'monospace',fontSize:'0.75rem'}}>{booking.paymentId}</span></div>}

          <div className={styles.qrSection}>
            <div className={styles.qrCode}>🎟️</div>
            <p className={styles.qrText}>Show this at the entrance</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={() => navigate('/bookings')}>My Bookings</button>
          <button className={styles.secondaryBtn} onClick={() => navigate('/')}>Browse More</button>
        </div>
      </div>
    </div>
  );
}
