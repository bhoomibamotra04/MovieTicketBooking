/**
 * MOVIE SERVICE — Port 3002
 * Handles: movies listing/search, showtimes, seat availability
 */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/movies',    require('./routes/movies'));
app.use('/api/showtimes', require('./routes/showtimes'));

// Health check
app.get('/health', (req, res) => res.json({ service: 'movie-service', status: 'running' }));

app.use((err, req, res, next) => res.status(500).json({ message: err.message }));

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('[movie-service] MongoDB connected');
  app.listen(process.env.PORT, () =>
    console.log(`[movie-service] Running on port ${process.env.PORT}`)
  );
}).catch(console.error);
