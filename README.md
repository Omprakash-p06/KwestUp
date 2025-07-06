# KwestUp - Your Ultimate Task Manager and Focus Companion

KwestUp is a unique to-do list application designed to help you manage your daily tasks, remember important birthdays, track personal goals, and maintain focus with a dedicated study timer. This project is built using React with Material-UI for a modern and intuitive user experience.

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Creating Desktop Executable (.exe)](#creating-desktop-executable-exe)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Future Considerations](#future-considerations)
- [License](#license)

## Features

- **Normal Daily Tasks**: Get daily reminders (simulated in this web version) to ensure tasks are completed consistently.
- **Birthdays**: Receive annual notifications (simulated in-app pop-ups) for birthdays.
- **Tasks (Goals)**: Manage general goals and tasks that can be completed anytime.
- **Focus Study Timer**: A dedicated timer to help you stay focused, with a simulated lockout feature to minimize distractions.
- **Local Storage**: All task data is saved locally in your browser's localStorage (simulating .json files for a native app).
- **Material-UI Design**: A clean, modern, and responsive user interface.
- **Desktop App**: Can be packaged as a standalone Windows executable (.exe).

## Prerequisites

Before you begin, ensure you have the following software installed on your machine:

### 1. Node.js
**Description**: A JavaScript runtime environment that allows you to run JavaScript code outside of a web browser. It includes npm (Node Package Manager).

**Installation**:
1. Download the recommended LTS version from the official website: https://nodejs.org/
2. Run the installer and follow the installation wizard
3. Make sure to check the option to add Node.js to your PATH during installation

**Verification**: Open your terminal/command prompt and run:
```bash
node --version
npm --version
```
You should see version numbers for both (e.g., v18.17.0 and 9.6.7).

### 2. Git (Optional but Recommended)
**Description**: Version control system for tracking changes in your code.

**Installation**:
1. Download from: https://git-scm.com/
2. Run the installer with default settings
3. Verify installation: `git --version`

### 3. Code Editor (Recommended)
**Description**: A text editor designed for coding, offering features like syntax highlighting, autocompletion, and integrated terminals.

**Recommendation**: Visual Studio Code (VS Code) - https://code.visualstudio.com/

## Installation

### Step 1: Clone or Download the Project

**Option A: Using Git (Recommended)**
```bash
git clone <repository-url>
cd kwestup-app
```

**Option B: Download ZIP**
1. Download the project as a ZIP file
2. Extract it to your desired location
3. Open terminal/command prompt in the extracted folder

### Step 2: Install Dependencies

Navigate to the project directory and install all required dependencies:

```bash
# Navigate to project directory
cd kwestup-app

# Install dependencies
npm install
```

This will install all the required packages including:
- React and React DOM
- Material-UI components
- Electron (for desktop app)
- Electron Builder (for creating .exe files)
- Other development dependencies

### Step 3: Verify Installation

After installation, verify everything is working:

```bash
# Check if all dependencies are installed
npm list --depth=0

# Should show all packages without any missing dependencies
```

## Running the Application

### Web Version (Development)

To run the application in your web browser for development:

```bash
npm start
```

This will:
- Start the development server
- Open the application in your default browser (usually at http://localhost:3000)
- Enable hot reloading (changes will automatically refresh the page)

### Desktop Version (Development)

To run the application as a desktop app during development:

```bash
npm run electron-dev
```

This will:
- Start the React development server
- Launch the Electron desktop app
- Connect the desktop app to the development server

### Desktop Version (Production Build)

To run the production version of the desktop app:

```bash
# First build the React app
npm run build

# Then run the Electron app
npm run electron
```

## Building for Production

### Web Version

To create an optimized, static build of your application for deployment to a web server:

```bash
npm run build
```

This will create a `build` folder containing all the necessary static files that can be hosted on any web server.

### Desktop Version

To create a standalone desktop application:

```bash
# Build for all platforms
npm run dist

# Build specifically for Windows
npm run dist-win
```

## Creating Desktop Executable (.exe)

### Prerequisites for .exe Creation

1. **Windows**: You're already on Windows, so you're good to go!
2. **Node.js**: Must be installed (see Prerequisites section)
3. **Internet Connection**: Required for downloading Electron binaries during the first build

### Step-by-Step Process

#### Step 1: Prepare the Project
```bash
# Ensure you're in the project directory
cd kwestup-app

# Install all dependencies (if not already done)
npm install
```

#### Step 2: Create App Icon (Optional but Recommended)
1. Create a 256x256 pixel icon image
2. Convert it to .ico format using online tools like:
   - https://convertio.co/png-ico/
   - https://www.icoconverter.com/
3. Replace the placeholder file at `electron/assets/icon.ico`

#### Step 3: Build the .exe File
```bash
# Build for Windows specifically
npm run dist-win
```

This command will:
1. Build the React application (`npm run build`)
2. Package it with Electron
3. Create an installer in the `dist` folder

#### Step 4: Find Your .exe File
After the build completes successfully, you'll find:
- **Installer**: `dist/KwestUp Setup.exe` (recommended for distribution)
- **Portable**: `dist/win-unpacked/KwestUp.exe` (can be run without installation)

### Build Output

The build process creates several files in the `dist` folder:
- `KwestUp Setup.exe` - Windows installer (recommended)
- `win-unpacked/` - Folder containing the portable version
- `builder-debug.yml` - Build configuration log

### Installing the Application

1. **Using Installer (Recommended)**:
   - Double-click `KwestUp Setup.exe`
   - Follow the installation wizard
   - Choose installation directory
   - The app will be available in Start Menu and Desktop

2. **Portable Version**:
   - Navigate to `dist/win-unpacked/`
   - Double-click `KwestUp.exe`
   - No installation required

## Project Structure

```
kwestup-app/
├── public/                 # Static files
│   ├── index.html         # Main HTML file
│   └── favicon.ico        # App icon
├── src/                   # React source code
│   ├── App.js            # Main application component
│   ├── App.css           # Application styles
│   └── index.js          # Application entry point
├── electron/              # Electron configuration
│   ├── main.js           # Main Electron process
│   ├── preload.js        # Preload script
│   └── assets/           # Electron assets
│       └── icon.ico      # App icon for desktop
├── package.json          # Project configuration
├── README.md             # This file
└── .gitignore           # Git ignore rules
```

## Troubleshooting

### Common Issues and Solutions

#### 1. "npm is not recognized"
**Problem**: Node.js is not installed or not in PATH
**Solution**: 
- Install Node.js from https://nodejs.org/
- Restart your terminal/command prompt
- Verify with `node --version` and `npm --version`

#### 2. "Port 3000 is already in use"
**Problem**: Another application is using port 3000
**Solution**:
```bash
# Kill the process using port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use a different port
set PORT=3001 && npm start
```

#### 3. "Electron build fails"
**Problem**: Various reasons for build failure
**Solutions**:
- Ensure you have a stable internet connection
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Check Windows Defender/firewall settings

#### 4. "App icon not showing"
**Problem**: Icon file is missing or invalid
**Solution**:
- Ensure `electron/assets/icon.ico` exists
- Use a valid .ico file (256x256 pixels recommended)
- Rebuild the application

#### 5. "Build process is slow"
**Problem**: First build downloads Electron binaries
**Solution**:
- This is normal for the first build
- Subsequent builds will be faster
- Ensure stable internet connection

### Performance Tips

1. **Development**: Use `npm start` for faster development cycles
2. **Testing**: Use `npm run electron-dev` to test desktop features
3. **Production**: Use `npm run dist-win` only when ready to distribute

## Future Considerations

### Native App Development
While this React application provides a great web-based experience and can be wrapped for desktop using Electron, if your primary goal is a truly native Windows and Android app with direct file system access for .json files and robust system notifications/lockout, consider:

- **Python with Kivy**: For cross-platform native apps
- **React Native**: For mobile apps
- **Flutter**: For cross-platform mobile and desktop apps

### Enhanced Features
- **System Notifications**: True OS-level notifications
- **File System Integration**: Direct .json file access
- **Advanced Lockout**: OS-level window management
- **Cloud Sync**: Data synchronization across devices
- **Offline Support**: Full offline functionality

## License

This project is open-source and available under the MIT License.

## Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Ensure all prerequisites are properly installed
3. Verify you're using the latest Node.js LTS version
4. Check the project's issue tracker (if available)

---

**Happy Task Managing with KwestUp! 🚀**