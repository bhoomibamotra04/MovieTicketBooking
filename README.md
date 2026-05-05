# Movie Ticket Booking System

A full-stack MERN app with microservices architecture — BookMyShow style UI.

## Tech Stack
- **Frontend**: React, React Router v6, CSS Modules
- **Backend**: Node.js + Express (microservices)
- **Database**: MongoDB
- **Architecture**: 5 independent services + API Gateway

## Project Structure
```
movie-booking/
├── frontend/                  React app (port 3000)
├── backend/
│   ├── auth-service/          User auth, JWT (port 3001)
│   ├── movie-service/         Movies, showtimes, seats (port 3002)
│   ├── booking-service/       Bookings, cancellations (port 3003)
│   ├── payment-service/       Payments (port 3004)
│   ├── api-gateway/           Single entry point (port 5000)
│   ├── seed.js                Sample data loader
│   └── start-services.bat     Starts all backend services
├── setup.bat                  First-time setup (installs dependencies)
└── start-all.bat              Starts everything with one click
```

---

## Prerequisites (install these first)

1. **Node.js** — https://nodejs.org (LTS version)
2. **MongoDB Community** — https://www.mongodb.com/try/download/community
   - During install: check "Install MongoDB as a Service"

---

## Running on a New Machine (First Time)

### Step 1 — Open VS Code
Open the project folder in VS Code.

### Step 2 — Open Terminal in VS Code
Press `` Ctrl+` `` to open the terminal.

### Step 3 — Run setup (installs all dependencies)
```
setup.bat
```

### Step 4 — Start MongoDB
Make sure MongoDB is running. Either:
- It runs automatically as a Windows service (if installed with "Install as Service")
- Or open CMD as Admin and run: `net start MongoDB`

### Step 5 — Seed the database
```
node backend\seed.js
```

### Step 6 — Start everything
```
start-all.bat
```

This opens:
- 5 backend service windows
- 1 frontend window

### Step 7 — Open the app
http://localhost:3000

---

## Running After First Setup

Just run:
```
start-all.bat
```

---

## Default Login
| Role  | Email                  | Password  |
|-------|------------------------|-----------|
| Admin | admin@moviebook.com    | admin123  |
| User  | Register from the UI   | —         |

---

## API Endpoints (via Gateway on port 5000)

| Method | Endpoint                        | Description           |
|--------|---------------------------------|-----------------------|
| POST   | /api/auth/register              | Register user         |
| POST   | /api/auth/login                 | Login                 |
| GET    | /api/movies                     | List all movies       |
| GET    | /api/movies?genre=Action        | Filter by genre       |
| GET    | /api/movies/:id                 | Movie details         |
| GET    | /api/showtimes?movieId=&date=   | Get showtimes         |
| GET    | /api/showtimes/:id              | Showtime + seats      |
| POST   | /api/bookings                   | Create booking        |
| GET    | /api/bookings/my                | My bookings           |
| PUT    | /api/bookings/:id/cancel        | Cancel booking        |
| POST   | /api/payments                   | Process payment       |

---

## Cinemas (PCMC, Pune)
- INOX: Elpro City Square, Chinchwad
- PVR: Xion Mall, Wakad
- Cinepolis: Nexus Westend Mall, Aundh
- E-Square: Xion Mall, Hinjawadi
- PVR INOX: Phoenix Market City, Nagar Road
