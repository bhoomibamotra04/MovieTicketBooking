import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import styles from './MovieDetails.module.css';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    api.get(`/movies/${id}`).then(({ data }) => setMovie(data)).catch(console.error);
  }, [id]);

  if (!movie) return <p className={styles.loading}>Loading...</p>;

  return (
    <div className={styles.page}>
      <div className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <img
              src={movie.posterUrl || 'https://via.placeholder.com/200x290?text=No+Poster'}
              alt={movie.title}
              className={styles.poster}
            />
            <div className={styles.info}>
              <h1 className={styles.title}>{movie.title}</h1>
              <div className={styles.tags}>
                {movie.genre?.map((g) => <span key={g} className={styles.tag}>{g}</span>)}
                <span className={styles.tag}>{movie.language}</span>
                <span className={styles.tag}>{movie.duration} min</span>
              </div>
              <div className={styles.ratingRow}>
                <span className={styles.rating}>⭐ {movie.rating}/10</span>
                <span className={styles.votes}>User Rating</span>
              </div>
              <p className={styles.desc}>{movie.description}</p>
              <div className={styles.metaGrid}>
                {movie.director && (
                  <div className={styles.metaItem}>
                    <label>Director</label>
                    <span>{movie.director}</span>
                  </div>
                )}
                {movie.cast?.length > 0 && (
                  <div className={styles.metaItem}>
                    <label>Cast</label>
                    <span>{movie.cast.join(', ')}</span>
                  </div>
                )}
              </div>
              <button className={styles.bookBtn} onClick={() => navigate(`/movies/${id}/showtimes`)}>
                Book tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
