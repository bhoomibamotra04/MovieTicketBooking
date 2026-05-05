@echo off
echo ============================================
echo   Movie Booking - Starting All Services
echo ============================================

start "Auth Service    [port 3001]" cmd /k "cd /d %~dp0auth-service && node server.js"
timeout /t 1 /nobreak >nul

start "Movie Service   [port 3002]" cmd /k "cd /d %~dp0movie-service && node server.js"
timeout /t 1 /nobreak >nul

start "Booking Service [port 3003]" cmd /k "cd /d %~dp0booking-service && node server.js"
timeout /t 1 /nobreak >nul

start "Payment Service [port 3004]" cmd /k "cd /d %~dp0payment-service && node server.js"
timeout /t 1 /nobreak >nul

start "API Gateway     [port 5000]" cmd /k "cd /d %~dp0api-gateway && node server.js"

echo.
echo All 5 services started!
echo API Gateway running at http://localhost:5000
echo.
