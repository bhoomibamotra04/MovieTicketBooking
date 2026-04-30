import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import styles from './Showtimes.module.css';

export default function Showtimes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  useEffect(() => {
    setSelectedDate(dates[0].toISOString().split('T')[0]);
    api.get(`/movies/${id}`).then(({ data }) => setMovie(data)).catch(console.error);
  }, [id]);

  useEffect(() => {
    if (selectedDate) {
      api.get('/showtimes', { params: { movieId: id, date: selectedDate } })
        .then(({ data }) => setShowtimes(data))
        .catch(console.error);
    }
  }, [id, selectedDate]);

  const grouped = showtimes.reduce((acc, st) => {
    if (!acc[st.theater]) acc[st.theater] = [];
    acc[st.theater].push(st);
    return acc;
  }, {});

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.heading}>{movie?.title}</h2>
        <p className={styles.sub}>Select Date &amp; Time</p>

        <div className={styles.dateStrip}>
          {dates.map((d) => {
            const iso = d.toISOString().split('T')[0];
            const active = selectedDate === iso;
            return (
              <button key={iso} className={`${styles.dateBtn} ${active ? styles.active : ''}`} onClick={() => setSelectedDate(iso)}>
                <span>{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span className={styles.dayNum}>{d.getDate()}</span>
                <span>{d.toLocaleDateString('en-US', { month: 'short' })}</span>
              </button>
            );
          })}
        </div>

        {Object.keys(grouped).length === 0 ? (
          <div className={styles.empty}>No shows available for this date.</div>
        ) : (
          Object.entries(grouped).map(([theater, shows]) => (
            <div key={theater} className={styles.theaterCard}>
              <div className={styles.theaterHeader}>
                <span className={styles.theaterName}>{theater}</span>
                <span className={styles.theaterTag}>AVAILABLE</span>
              </div>
              <p className={styles.theaterMeta}>{shows[0]?.screen}</p>
              <hr className={styles.divider} />
              <div className={styles.times}>
                {shows.map((st) => (
                  <button key={st._id} className={styles.timeBtn} onClick={() => navigate(`/showtimes/${st._id}/seats`)}>
                    {st.startTime}
                  </button>
                ))}
              </div>
              <p className={styles.priceHint}>Regular ₹{shows[0]?.regularPrice} &nbsp;|&nbsp; Premium ₹{shows[0]?.premiumPrice} &nbsp;|&nbsp; VIP ₹{shows[0]?.vipPrice}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
