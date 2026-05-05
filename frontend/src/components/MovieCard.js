import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MovieCard.module.css';

export default function MovieCard({ movie }) {
  const navigate = useNavigate();
  return (
    <div className={styles.card} onClick={() => navigate(`/movies/${movie._id}`)}>
      <div className={styles.posterWrap}>
        <img
          src={movie.posterUrl || '/images/placeholder.png'}
          alt={movie.title}
          className={styles.poster}
          onError={(e) => { e.target.onerror = null; e.target.src = '/images/placeholder.png'; }}
        />
        <div className={styles.overlay}>
          <button className={styles.bookBtn}>Book tickets</button>
        </div>
        <div className={styles.likeBadge}>👍 {Math.floor(80 + Math.random() * 19)}%</div>
      </div>
      <div className={styles.info}>
        <p className={styles.title}>{movie.title}</p>
        <p className={styles.meta}>{movie.genre?.join(' / ')}</p>
        <div className={styles.footer}>
          <span className={styles.rating}>⭐ {movie.rating}</span>
          <span className={styles.lang}>{movie.language}</span>
        </div>
      </div>
    </div>
  );
}
