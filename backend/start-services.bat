@echo off
echo Starting all microservices...

start "Auth Service" cmd /k "cd /d %~dp0auth-service && node server.js"
start "Movie Service" cmd /k "cd /d %~dp0movie-service && node server.js"
start "Booking Service" cmd /k "cd /d %~dp0booking-service && node server.js"
start "Payment Service" cmd /k "cd /d %~dp0payment-service && node server.js"
start "API Gateway" cmd /k "cd /d %~dp0api-gateway && node server.js"

echo All services started!
