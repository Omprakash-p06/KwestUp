@echo off
setlocal

:: ========================================
:: QuestUp Installation Script
:: ========================================
echo.
echo Checking for required dependencies...
echo.

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version and run the installer.
    echo Make sure to check "Add to PATH" during installation.
    echo.
    pause
    exit /b 1
)
echo Node.js is installed. Version:
node --version

:: Check npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed or not in PATH!
    echo Please reinstall Node.js and ensure npm is included.
    echo.
    pause
    exit /b 1
)
echo npm is available. Version:
npm --version

:: Check git
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed or not in PATH!
    echo Please install Git from: https://git-scm.com/downloads
    echo.
    pause
    exit /b 1
)
echo Git is available. Version:
git --version

:: Check for required project files and folders
echo.
echo Checking for required project files and folders...
if not exist package.json (
    echo ERROR: package.json not found! Are you in the project root directory?
    pause
    exit /b 1
)
if not exist src (
    echo ERROR: src folder not found! Project source code is missing.
    pause
    exit /b 1
)
if not exist public (
    echo ERROR: public folder not found! Project public assets are missing.
    pause
    exit /b 1
)
if not exist electron (
    echo ERROR: electron folder not found! Electron main process files are missing.
    pause
    exit /b 1
)
echo All required files and folders are present.

:: Install npm dependencies
echo.
echo Installing project dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

:: Check react-scripts
echo.
echo Checking if react-scripts is available...
npx react-scripts --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: react-scripts is not installed or not working!
    echo Try running: npm install
    echo If the problem persists, check your package.json and node_modules.
    pause
    exit /b 1
)
echo react-scripts is available. Version:
npx react-scripts --version

:: Check electron
echo.
echo Checking if electron is available...
npx electron --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: electron is not installed or not working!
    echo Try running: npm install
    echo If the problem persists, check your package.json and node_modules.
    pause
    exit /b 1
)
echo electron is available. Version:
npx electron --version

:: Check electron-builder
echo.
echo Checking if electron-builder is available...
npx electron-builder --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: electron-builder is not installed or not working!
    echo Try running: npm install
    echo If the problem persists, check your package.json and node_modules.
    pause
    exit /b 1
)
echo electron-builder is available. Version:
npx electron-builder --version

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
endlocal 