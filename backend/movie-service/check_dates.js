const mongoose = require('mongoose');
const Showtime = require('./models/Showtime');

async function checkDates() {
  await mongoose.connect('mongodb://127.0.0.1:27017/moviebooking');
  const dates = await Showtime.distinct('date');
  console.log(dates);
  process.exit(0);
}
checkDates();
