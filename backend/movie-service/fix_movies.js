
const mongoose = require('mongoose');
const validPosters = {
  'Prisoners': 'https://image.tmdb.org/t/p/w500/A0HLBf0Fuk2i6B4LpU4eWqJ0O5j.jpg',
  'Gone Girl': 'https://image.tmdb.org/t/p/w500/qymaEx4s6yK7f53vA3k5tB1tB6R.jpg',
  'Crazy, Stupid, Love': 'https://image.tmdb.org/t/p/w500/tF4qCqQ6R26v5h2G6rN0zH46L7C.jpg',
  'Pride & Prejudice': 'https://image.tmdb.org/t/p/w500/vlv1gn98GqdX1ptHQ8Hq9Kj2P0m.jpg',
  'The Notebook': 'https://image.tmdb.org/t/p/w500/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg',
  'Dune': 'https://image.tmdb.org/t/p/w500/d5NXSklpcvkCgnpLIOuibQ46tFo.jpg'
};

mongoose.connect('mongodb://localhost:27017/moviebooking').then(async () => {
  const db = mongoose.connection.db;
  const collection = db.collection('movies');
  
  for (const [title, url] of Object.entries(validPosters)) {
    await collection.updateOne({ title: new RegExp('^' + title, 'i') }, { $set: { posterUrl: url } });
    console.log('Updated ' + title);
  }
  
  console.log('Done!');
  process.exit(0);
});

