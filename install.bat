@echo off
echo ========================================
echo QuestUp Installation Script
echo ========================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version and run the installer.
    echo Make sure to check "Add to PATH" during installation.
    echo.
    pause
    exit /b 1
)

echo Node.js is installed. Version:
node --version
echo.

echo Checking if npm is available...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not available!
    echo Please reinstall Node.js and ensure npm is included.
    pause
    exit /b 1
)

echo npm is available. Version:
npm --version
echo.

echo Installing project dependencies...
echo This may take a few minutes on first run...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation completed successfully!
echo ========================================
echo.
echo To run the application:
echo 1. Web version: npm start
echo 2. Desktop version: npm run electron-dev
echo 3. Build .exe: npm run dist-win
echo.
echo For more information, see README.md
echo.
pause 