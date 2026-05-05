// Run: node seed.js
// Seeds movies across all genres with showtimes for the next 7 days

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env from auth-service (has MONGO_URI)
dotenv.config({ path: path.join(__dirname, 'auth-service', '.env') });

const Movie = require('./movie-service/models/Movie');
const Showtime = require('./movie-service/models/Showtime');
const User = require('./auth-service/models/User');

const movies = [
  // ACTION
  {
    title: 'The Dark Knight',
    description: 'Batman faces the Joker, a criminal mastermind who wants to plunge Gotham City into anarchy.',
    genre: ['Action'],
    duration: 152, language: 'English', rating: 9.0,
    posterUrl: '/images/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
  },
  {
    title: 'Avengers: Endgame',
    description: 'The Avengers assemble once more to reverse Thanos\'s devastating actions.',
    genre: ['Action'],
    duration: 181, language: 'English', rating: 8.4,
    posterUrl: '/images/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
    director: 'Anthony Russo',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo'],
  },
  {
    title: 'Mad Max: Fury Road',
    description: 'In a post-apocalyptic wasteland, Max teams up with Furiosa to flee a warlord.',
    genre: ['Action'],
    duration: 120, language: 'English', rating: 8.1,
    posterUrl: '/images/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg',
    director: 'George Miller',
    cast: ['Tom Hardy', 'Charlize Theron'],
  },
  {
    title: 'John Wick',
    description: 'An ex-hitman comes out of retirement to track down the gangsters who killed his dog.',
    genre: ['Action'],
    duration: 101, language: 'English', rating: 7.4,
    posterUrl: '/images/fZPSd91yGE9fCcCe6OoQr6E3Bev.jpg',
    director: 'Chad Stahelski',
    cast: ['Keanu Reeves', 'Michael Nyqvist'],
  },
  {
    title: 'Top Gun: Maverick',
    description: 'After 30 years, Maverick is still pushing the envelope as a top naval aviator.',
    genre: ['Action'],
    duration: 130, language: 'English', rating: 8.3,
    posterUrl: '/images/62HCnUTziyWcpDaBO2i1DX17ljH.jpg',
    director: 'Joseph Kosinski',
    cast: ['Tom Cruise', 'Miles Teller', 'Jennifer Connelly'],
  },

  // COMEDY
  {
    title: 'The Grand Budapest Hotel',
    description: 'A writer encounters the owner of an aging European hotel between the wars.',
    genre: ['Comedy'],
    duration: 99, language: 'English', rating: 8.1,
    posterUrl: '/images/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg',
    director: 'Wes Anderson',
    cast: ['Ralph Fiennes', 'Tony Revolori'],
  },
  {
    title: 'Superbad',
    description: 'Two co-dependent high school seniors try to score alcohol for a party.',
    genre: ['Comedy'],
    duration: 113, language: 'English', rating: 7.6,
    posterUrl: '/images/ek8e8txUyUwd2BNqj6lFEerJfbq.jpg',
    director: 'Greg Mottola',
    cast: ['Jonah Hill', 'Michael Cera'],
  },
  {
    title: 'Knives Out',
    description: 'A detective investigates the death of a patriarch of an eccentric, combative family.',
    genre: ['Comedy'],
    duration: 130, language: 'English', rating: 7.9,
    posterUrl: '/images/pThyQovXQrws2hmUT087tUtHtj.jpg',
    director: 'Rian Johnson',
    cast: ['Daniel Craig', 'Chris Evans', 'Ana de Armas'],
  },
  {
    title: 'The Hangover',
    description: 'Three buddies wake up from a bachelor party in Las Vegas with no memory of the previous night.',
    genre: ['Comedy'],
    duration: 100, language: 'English', rating: 7.7,
    posterUrl: '/images/uluhlXubGu1VxU63X9VHCLWDAYP.jpg',
    director: 'Todd Phillips',
    cast: ['Bradley Cooper', 'Ed Helms', 'Zach Galifianakis'],
  },
  {
    title: 'Dumb and Dumber',
    description: 'Two dim-witted friends travel across the country to return a briefcase to a woman.',
    genre: ['Comedy'],
    duration: 107, language: 'English', rating: 7.3,
    posterUrl: '/images/2gSXQ1RMuKBBBGHBqBpTHqBMnFj.jpg',
    director: 'Peter Farrelly',
    cast: ['Jim Carrey', 'Jeff Daniels'],
  },

  // DRAMA
  {
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over years, finding solace and eventual redemption.',
    genre: ['Drama'],
    duration: 142, language: 'English', rating: 9.3,
    posterUrl: '/images/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    director: 'Frank Darabont',
    cast: ['Tim Robbins', 'Morgan Freeman'],
  },
  {
    title: 'Forrest Gump',
    description: 'The presidencies of Kennedy and Johnson through the eyes of an Alabama man.',
    genre: ['Drama'],
    duration: 142, language: 'English', rating: 8.8,
    posterUrl: '/images/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    director: 'Robert Zemeckis',
    cast: ['Tom Hanks', 'Robin Wright'],
  },
  {
    title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control to his son.',
    genre: ['Drama'],
    duration: 175, language: 'English', rating: 9.2,
    posterUrl: '/images/3bhkrj58Vtu7enYsLeMMovrI8i1.jpg',
    director: 'Francis Ford Coppola',
    cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
  },
  {
    title: 'Schindler\'s List',
    description: 'In German-occupied Poland, Oskar Schindler saves the lives of more than a thousand Jewish refugees.',
    genre: ['Drama'],
    duration: 195, language: 'English', rating: 9.0,
    posterUrl: '/images/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg',
    director: 'Steven Spielberg',
    cast: ['Liam Neeson', 'Ralph Fiennes'],
  },
  {
    title: '12 Angry Men',
    description: 'A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider.',
    genre: ['Drama'],
    duration: 96, language: 'English', rating: 9.0,
    posterUrl: '/images/ppd84D2i9W8jXmsyInGyihiSyqz.jpg',
    director: 'Sidney Lumet',
    cast: ['Henry Fonda', 'Lee J. Cobb'],
  },

  // HORROR
  {
    title: 'Get Out',
    description: 'A young African-American visits his white girlfriend\'s parents for the weekend.',
    genre: ['Horror'],
    duration: 104, language: 'English', rating: 7.7,
    posterUrl: '/images/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg',
    director: 'Jordan Peele',
    cast: ['Daniel Kaluuya', 'Allison Williams'],
  },
  {
    title: 'A Quiet Place',
    description: 'A family struggles to survive in a post-apocalyptic world inhabited by blind monsters.',
    genre: ['Horror'],
    duration: 90, language: 'English', rating: 7.5,
    posterUrl: '/images/nAU74GmpUk7t5iklEp3bufwDq4n.jpg',
    director: 'John Krasinski',
    cast: ['Emily Blunt', 'John Krasinski'],
  },
  {
    title: 'Hereditary',
    description: 'A grieving family is haunted by tragic and disturbing occurrences.',
    genre: ['Horror'],
    duration: 127, language: 'English', rating: 7.3,
    posterUrl: '/images/p9UDzKMz6ekHFMFkFMFMFMFMFMF.jpg',
    director: 'Ari Aster',
    cast: ['Toni Collette', 'Alex Wolff'],
  },
  {
    title: 'The Conjuring',
    description: 'Paranormal investigators help a family terrorized by a dark presence in their farmhouse.',
    genre: ['Horror'],
    duration: 112, language: 'English', rating: 7.5,
    posterUrl: '/images/wVYREutTvI2tmxr6ujrHT704wGF.jpg',
    director: 'James Wan',
    cast: ['Patrick Wilson', 'Vera Farmiga'],
  },
  {
    title: 'It',
    description: 'A group of bullied kids band together when a shapeshifting monster emerges from the sewers.',
    genre: ['Horror'],
    duration: 135, language: 'English', rating: 7.3,
    posterUrl: '/images/9E2y5Q7WlCVHRowKjgniH6f0An9.jpg',
    director: 'Andy Muschietti',
    cast: ['Bill Skarsgård', 'Jaeden Martell'],
  },

  // ROMANCE
  {
    title: 'Titanic',
    description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the Titanic.',
    genre: ['Romance'],
    duration: 194, language: 'English', rating: 7.9,
    posterUrl: '/images/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
    director: 'James Cameron',
    cast: ['Leonardo DiCaprio', 'Kate Winslet'],
  },
  {
    title: 'The Notebook',
    description: 'A poor yet passionate young man falls in love with a rich young woman.',
    genre: ['Romance'],
    duration: 123, language: 'English', rating: 7.8,
    posterUrl: '/images/rNzQyW4f8B8cQeg7Dgj3n6eT5k9.jpg',
    director: 'Nick Cassavetes',
    cast: ['Ryan Gosling', 'Rachel McAdams'],
  },
  {
    title: 'La La Land',
    description: 'A jazz musician and an aspiring actress fall in love while pursuing their dreams in LA.',
    genre: ['Romance'],
    duration: 128, language: 'English', rating: 8.0,
    posterUrl: '/images/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
    director: 'Damien Chazelle',
    cast: ['Ryan Gosling', 'Emma Stone'],
  },
  {
    title: 'Pride & Prejudice',
    description: 'Sparks fly when spirited Elizabeth Bennet meets single, rich Mr. Darcy.',
    genre: ['Romance'],
    duration: 129, language: 'English', rating: 7.8,
    posterUrl: '/images/vlv1gn98GqdX1ptHQ8Hq9Kj2P0m.jpg',
    director: 'Joe Wright',
    cast: ['Keira Knightley', 'Matthew Macfadyen'],
  },
  {
    title: 'Crazy, Stupid, Love',
    description: 'A middle-aged husband\'s life changes dramatically when his wife asks for a divorce.',
    genre: ['Romance'],
    duration: 118, language: 'English', rating: 7.4,
    posterUrl: '/images/tF4qCqQ6R26v5h2G6rN0zH46L7C.jpg',
    director: 'Glenn Ficarra',
    cast: ['Steve Carell', 'Ryan Gosling', 'Emma Stone'],
  },

  // THRILLER
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task.',
    genre: ['Thriller'],
    duration: 148, language: 'English', rating: 8.8,
    posterUrl: '/images/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt'],
  },
  {
    title: 'Gone Girl',
    description: 'With his wife\'s disappearance having become the focus of an intense media circus.',
    genre: ['Thriller'],
    duration: 149, language: 'English', rating: 8.1,
    posterUrl: '/images/qymaEx4s6yK7f53vA3k5tB1tB6R.jpg',
    director: 'David Fincher',
    cast: ['Ben Affleck', 'Rosamund Pike'],
  },
  {
    title: 'Parasite',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between two families.',
    genre: ['Thriller'],
    duration: 132, language: 'Korean', rating: 8.5,
    posterUrl: '/images/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    director: 'Bong Joon-ho',
    cast: ['Song Kang-ho', 'Lee Sun-kyun'],
  },
  {
    title: 'Se7en',
    description: 'Two detectives hunt a serial killer who uses the seven deadly sins as his motives.',
    genre: ['Thriller'],
    duration: 127, language: 'English', rating: 8.6,
    posterUrl: '/images/6yoghtyTpznpBik8EngEmJskVUO.jpg',
    director: 'David Fincher',
    cast: ['Brad Pitt', 'Morgan Freeman'],
  },
  {
    title: 'Prisoners',
    description: 'When two young girls go missing, a desperate father takes matters into his own hands.',
    genre: ['Thriller'],
    duration: 153, language: 'English', rating: 8.1,
    posterUrl: '/images/A0HLBf0Fuk2i6B4LpU4eWqJ0O5j.jpg',
    director: 'Denis Villeneuve',
    cast: ['Hugh Jackman', 'Jake Gyllenhaal'],
  },

  // SCI-FI
  {
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space to ensure humanity\'s survival.',
    genre: ['Sci-Fi'],
    duration: 169, language: 'English', rating: 8.6,
    posterUrl: '/images/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway'],
  },
  {
    title: 'The Matrix',
    description: 'A computer hacker learns about the true nature of reality and his role in the war against its controllers.',
    genre: ['Sci-Fi'],
    duration: 136, language: 'English', rating: 8.7,
    posterUrl: '/images/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg',
    director: 'Lana Wachowski',
    cast: ['Keanu Reeves', 'Laurence Fishburne'],
  },
  {
    title: 'Dune',
    description: 'A noble family becomes embroiled in a war for control over the galaxy\'s most valuable asset.',
    genre: ['Sci-Fi'],
    duration: 155, language: 'English', rating: 8.0,
    posterUrl: '/images/d5NXSklpcvkCgnpLIOuibQ46tFo.jpg',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya'],
  },
  {
    title: 'Arrival',
    description: 'A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear.',
    genre: ['Sci-Fi'],
    duration: 116, language: 'English', rating: 7.9,
    posterUrl: '/images/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg',
    director: 'Denis Villeneuve',
    cast: ['Amy Adams', 'Jeremy Renner'],
  },
  {
    title: 'Blade Runner 2049',
    description: 'A young blade runner discovers a long-buried secret that leads him to track down former blade runner Rick Deckard.',
    genre: ['Sci-Fi'],
    duration: 164, language: 'English', rating: 8.0,
    posterUrl: '/images/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg',
    director: 'Denis Villeneuve',
    cast: ['Ryan Gosling', 'Harrison Ford'],
  },
];

// Real cinemas in PCMC (Pimpri-Chinchwad), Pune
const theaters = [
  { name: 'INOX: Elpro City Square, Chinchwad',         screen: 'Screen 1' },
  { name: 'PVR: Xion Mall, Wakad',                      screen: 'Screen 2' },
  { name: 'Cinepolis: Nexus Westend Mall, Aundh',       screen: 'Screen 3' },
  { name: 'E-Square: Xion Mall, Hinjawadi',             screen: 'Screen 4' },
  { name: 'PVR INOX: Phoenix Market City, Nagar Road',  screen: 'Screen 5' },
];

const timeSlots = [
  { startTime: '10:00', endTime: '13:00' },
  { startTime: '13:30', endTime: '16:30' },
  { startTime: '17:00', endTime: '20:00' },
  { startTime: '20:30', endTime: '23:30' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await Movie.deleteMany({});
  await Showtime.deleteMany({});
  await User.deleteMany({ role: 'admin' });

  // Insert movies
  const createdMovies = await Movie.insertMany(movies);
  console.log(`✅ Seeded ${createdMovies.length} movies across 7 genres`);

  // Create admin user
  await User.create({
    name: 'Admin',
    email: 'admin@moviebook.com',
    password: 'admin123',
    role: 'admin',
  });
  console.log('✅ Admin: admin@moviebook.com / admin123');

  // Generate dates for next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  // Create showtimes: each movie × each date × 3 theaters × 2 time slots
  let showtimeCount = 0;
  for (const movie of createdMovies) {
    for (const date of dates) {
      for (const theater of theaters.slice(0, 3)) {
        for (const slot of timeSlots.slice(0, 2)) {
          await Showtime.create({
            movie: movie._id,
            theater: theater.name,
            screen: theater.screen,
            date,
            startTime: slot.startTime,
            endTime: slot.endTime,
            regularPrice: 150,
            premiumPrice: 250,
            vipPrice: 400,
          });
          showtimeCount++;
        }
      }
    }
  }

  console.log(`✅ Seeded ${showtimeCount} showtimes (7 days × 2 theaters × 2 slots per movie)`);
  console.log('\n🎬 Genres seeded: Action, Comedy, Drama, Horror, Romance, Thriller, Sci-Fi');
  console.log('📅 Dates available:', dates[0], '→', dates[6]);
  console.log('\nSeeding complete!');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
