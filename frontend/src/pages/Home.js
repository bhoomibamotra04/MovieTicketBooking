import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import MovieCard from '../components/MovieCard';
import styles from './Home.module.css';

const genres = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Thriller', 'Sci-Fi'];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [genre, setGenre] = useState('');
  const [loading, setLoading] = useState(true);
  const [inputVal, setInputVal] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => { fetchMovies(); }, [search, genre]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (genre) params.genre = genre;
      const { data } = await api.get('/movies', { params });
      setMovies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.heroBanner}>
        <h1>Movies, Events & More</h1>
        <p>Book tickets for the best entertainment near you</p>
        <div className={styles.heroSearch}>
          <input
            placeholder="Search for Movies, Events, Plays..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setSearch(inputVal)}
          />
          <button onClick={() => setSearch(inputVal)}>Search</button>
        </div>
      </div>

      <div className={styles.filterBar}>
        {genres.map((g) => (
          <button
            key={g}
            className={`${styles.filterTab} ${(g === 'All' ? !genre : genre === g) ? styles.active : ''}`}
            onClick={() => setGenre(g === 'All' ? '' : g)}
          >
            {g}
          </button>
        ))}
      </div>

      <div className={styles.container}>
        <div className={styles.promoBar}>
          <p>🎉 <strong>Weekend Offer:</strong> Get 20% off on VIP seats. Use code <strong>WEEKEND20</strong></p>
          <button className={styles.promoBtn}>Grab Deal</button>
        </div>

        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Now Showing in Cinemas</h2>
          <span className={styles.seeAll}>See All &rsaquo;</span>
        </div>

        {loading ? (
          <p className={styles.loading}>Loading movies...</p>
        ) : movies.length === 0 ? (
          <p className={styles.empty}>No movies found.</p>
        ) : (
          <div className={styles.grid}>
            {movies.map((m) => <MovieCard key={m._id} movie={m} />)}
          </div>
        )}
      </div>
    </>
  );
}
