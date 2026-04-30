import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo}>book<span>myshow</span></Link>

        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input placeholder="Search for Movies, Events, Plays, Sports and Activities" />
        </div>

        <div className={styles.links}>
          {user ? (
            <>
              <span className={styles.username}>👤 {user.name}</span>
              <Link to="/bookings" className={styles.myBookings}>My Bookings</Link>
              <button className={styles.logoutBtn} onClick={() => { logout(); navigate('/'); }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.loginBtn}>Sign In</Link>
              <Link to="/register" className={styles.signupBtn}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
