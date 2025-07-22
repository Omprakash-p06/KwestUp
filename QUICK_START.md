# KwestUp - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Node.js
1. Go to https://nodejs.org/
2. Download the LTS version (recommended)
3. Run the installer
4. **Important**: Check "Add to PATH" during installation

### Step 2: Install KwestUp
**Option A: Using the installer script (Windows)**
```bash
# Double-click install.bat
# OR run in command prompt:
install.bat
```

**Option B: Manual installation**
```bash
# Navigate to project folder
cd kwestup-app

# Install dependencies
npm install
```

### Step 3: Run the App
```bash
# Web version (recommended for first time)
npm start

# Desktop version
npm run electron-dev
```

## 📦 Create .exe File
```bash
# Build Windows executable
npm run dist-win

# Find your .exe in the dist/ folder
```

## 🆘 Need Help?
- Check the full [README.md](README.md) for detailed instructions
- See the [Troubleshooting](#troubleshooting) section below

## 🔧 Common Issues

### "npm is not recognized"
- Install Node.js from https://nodejs.org/
- Restart your command prompt
- Verify with `node --version`

### "Port 3000 is already in use"
```bash
# Use a different port
set PORT=3001 && npm start
```

### Build fails
- Check internet connection
- Clear cache: `npm cache clean --force`
- Reinstall: `rm -rf node_modules && npm install`

## 📱 What's Next?
- Try all features: Daily Tasks, Birthdays, Goals, Focus Timer
- Customize the app for your needs
- Share with friends and family!

---

**Happy Task Managing! 🎯** 