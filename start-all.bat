@echo off
echo ============================================
echo   Movie Booking App - Starting Everything
echo ============================================
echo.

:: Set npm path for systems where npm isn't in PATH
set "NPM_PATH=C:\Program Files\nodejs\npm.cmd"
if exist "%NPM_PATH%" (
    set "NPM=%NPM_PATH%"
) else (
    set "NPM=npm"
)

:: Check if node_modules exist, if not run setup
if not exist "frontend\node_modules" (
    echo Dependencies not installed. Running setup first...
    call setup.bat
)

echo.
echo Starting MongoDB check...
sc query MongoDB >nul 2>&1
if %errorlevel% equ 0 (
    net start MongoDB >nul 2>&1
    echo [OK] MongoDB service started
) else (
    echo [WARN] MongoDB service not found - make sure MongoDB is running manually
)

echo.
echo Seeding database with sample data...
node backend\seed.js
echo.

echo Starting all backend microservices...
call backend\start-services.bat

echo.
echo Waiting for services to start...
timeout /t 3 /nobreak >nul

echo Starting frontend...
start "Frontend [port 3000]" cmd /k "cd /d %~dp0frontend && "%NPM%" start"

echo.
echo ============================================
echo   Everything is running!
echo ============================================
echo.
echo   Frontend:  http://localhost:3000
echo   Gateway:   http://localhost:5000
echo.
echo   Login:  admin@moviebook.com / admin123
echo ============================================
echo.
