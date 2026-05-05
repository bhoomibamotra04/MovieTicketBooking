@echo off
echo ============================================
echo   Movie Booking - First Time Setup
echo ============================================
echo.

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install from https://nodejs.org and re-run this script.
    pause
    exit /b 1
)
echo [OK] Node.js found

:: Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm not found. Please reinstall Node.js.
    pause
    exit /b 1
)
echo [OK] npm found

echo.
echo Installing dependencies...
echo.

echo [1/6] Installing root dependencies...
call npm install
echo.

echo [2/6] Installing auth-service...
call npm install --prefix backend\auth-service
echo.

echo [3/6] Installing movie-service...
call npm install --prefix backend\movie-service
echo.

echo [4/6] Installing booking-service...
call npm install --prefix backend\booking-service
echo.

echo [5/6] Installing payment-service...
call npm install --prefix backend\payment-service
echo.

echo [6/6] Installing api-gateway...
call npm install --prefix backend\api-gateway
echo.

echo [7/7] Installing frontend...
call npm install --prefix frontend
echo.

echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo NEXT STEPS:
echo 1. Make sure MongoDB is running
echo 2. Run: node backend\seed.js   (loads sample data)
echo 3. Run: backend\start-services.bat   (starts backend)
echo 4. Run: npm start --prefix frontend  (starts frontend)
echo.
echo OR just run: start-all.bat
echo.
pause
