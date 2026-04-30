# Movie Ticket Booking System

A full-stack MERN application for browsing movies and booking tickets.

## Tech Stack
- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- Frontend: React, React Router v6, Axios, CSS Modules

## Project Structure
```
movie-booking/
├── backend/
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express routes
│   ├── middleware/     # JWT auth middleware
│   ├── seed.js         # Sample data seeder
│   └── server.js
└── frontend/
    └── src/
        ├── api/        # Axios instance
        ├── components/ # Reusable components
        ├── context/    # Auth context
        └── pages/      # Route pages
```

## Setup & Run

### Prerequisites
- Node.js >= 16
- MongoDB running locally on port 27017

### Backend
```bash
cd backend
npm install
node seed.js        # seed sample data
npm run dev         # starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm start           # starts on http://localhost:3000
```

## Default Accounts
After seeding:
- Admin: `admin@moviebook.com` / `admin123`
- Register a new user account from the UI

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/movies | List movies |
| GET | /api/movies/:id | Movie details |
| GET | /api/showtimes?movieId=&date= | Get showtimes |
| GET | /api/showtimes/:id | Showtime + seats |
| POST | /api/bookings | Create booking |
| GET | /api/bookings/my | User's bookings |
| PUT | /api/bookings/:id/cancel | Cancel booking |
| POST | /api/payments | Process payment |

## Features
- Browse and search movies by title/genre
- View showtimes by date
- Interactive seat map (Regular / Premium / VIP)
- Booking with seat locking (prevents double booking)
- Mock payment flow
- Booking history with cancel option
- JWT authentication
- Admin can add movies and showtimes via API
