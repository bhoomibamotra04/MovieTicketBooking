import React from 'react';
import styles from './SeatMap.module.css';

export default function SeatMap({ seats, selectedSeats, onSeatClick }) {
  const rows = [...new Set(seats.map((s) => s.row))];

  const getSeatClass = (seat) => {
    if (seat.isBooked) return styles.booked;
    if (selectedSeats.find((s) => s.seatNumber === seat.seatNumber)) return `${styles.seat} ${styles.selected}`;
    if (seat.type === 'vip') return `${styles.seat} ${styles.vip}`;
    if (seat.type === 'premium') return `${styles.seat} ${styles.premium}`;
    return `${styles.seat} ${styles.regular}`;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.screen}>SCREEN</div>
      {rows.map((row) => (
        <div key={row} className={styles.row}>
          <span className={styles.rowLabel}>{row}</span>
          {seats.filter((s) => s.row === row).map((seat, i) => (
            <React.Fragment key={seat.seatNumber}>
              {i === 5 && <div className={styles.gap} />}
              <button
                className={seat.isBooked ? `${styles.seat} ${styles.booked}` : getSeatClass(seat)}
                onClick={() => !seat.isBooked && onSeatClick(seat)}
                disabled={seat.isBooked}
                title={`${seat.seatNumber} • ${seat.type} • ₹${seat.price}`}
              >
                {i + 1}
              </button>
            </React.Fragment>
          ))}
          <span className={styles.rowLabel}>{row}</span>
        </div>
      ))}
      <div className={styles.legend}>
        <span><span className={`${styles.dot} ${styles.regular}`}></span>Regular</span>
        <span><span className={`${styles.dot} ${styles.premium}`}></span>Premium</span>
        <span><span className={`${styles.dot} ${styles.vip}`}></span>VIP</span>
        <span><span className={`${styles.dot} ${styles.selected}`}></span>Selected</span>
        <span><span className={`${styles.dot} ${styles.booked}`}></span>Booked</span>
      </div>
    </div>
  );
}
