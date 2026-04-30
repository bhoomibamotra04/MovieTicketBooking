import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import styles from './Auth.module.css';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Account created! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const update = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>🎬 BookMyMovie</div>
        <p className={styles.subtitle}>Join millions of movie lovers</p>
        <h2 className={styles.title}>Create Account</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Full Name</label>
            <input className={styles.input} placeholder="John Doe" value={form.name} onChange={update('name')} required />
          </div>
          <div className={styles.field}>
            <label>Email Address</label>
            <input className={styles.input} type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} required />
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input className={styles.input} type="password" placeholder="Min. 6 characters" value={form.password} onChange={update('password')} required />
          </div>
          <div className={styles.field}>
            <label>Phone (optional)</label>
            <input className={styles.input} placeholder="+91 99999 99999" value={form.phone} onChange={update('phone')} />
          </div>
          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className={styles.link}>Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
