# KwestUp

KwestUp is a productivity dashboard app built with React and Electron. Manage your tasks, goals, focus sessions, and more with a beautiful, modern UI.

## ✨ Features
- **Task & Goal Management**: Add, edit, and track daily and general tasks with priorities and subtasks.
- **Focus Timer**: Pomodoro-style focus timer with lockout overlay.
- **Birthday Reminders**: Add birthdays and get in-app reminders.
- **Calendar & Events**: Visual calendar with event scheduling, recurring events, and reminders.
- **Theming**: Multiple Linux-inspired themes, including AMOLED dark mode.
- **Cross-Platform**: Runs on Windows and Linux (AppImage, deb, exe installers).
- **Custom App Icons**: Uses playstore.png/.ico for branding on all platforms.

## 🐧 Linux Support
- Officially supports Linux (AppImage and deb packages).
- Uses a 512x512 PNG icon for Linux builds.
- Tested on Linux Mint.

## 🪟 Windows Support
- Builds a Windows NSIS installer (.exe) with a multi-resolution .ico icon.

---

## 🚀 Building a Production Installer

### 1. Prerequisites
- Node.js and npm installed
- [electron-builder](https://www.electron.build/) is a dev dependency
- Valid icons:
  - Linux: `electron/assets/icon.png` (512x512 PNG)
  - Windows: `public/playstore.ico` (multi-resolution .ico)

### 2. Build the React App
```bash
npm run build
```

### 3. Build the Electron Installer

#### For Linux (AppImage & deb)
```bash
npm run dist -- --linux
```
- Output: `dist/KwestUp-<version>.AppImage`, `dist/KwestUp_<version>_amd64.deb`

#### For Windows (.exe)
On Windows (or with Wine on Linux):
```bash
npm run dist -- --win
```
- Output: `dist/KwestUp Setup <version>.exe`

### 4. Run the AppImage (Linux)
```bash
chmod +x dist/KwestUp-*.AppImage
./dist/KwestUp-*.AppImage
```

---

## 🛠️ Troubleshooting
- **Icon errors:**
  - Linux: Use a valid 512x512 PNG for `electron/assets/icon.png`.
  - Windows: Use a multi-resolution .ico for `public/playstore.ico`.
- **Electron binary errors:**
  - Make sure you have the correct Electron binary for your OS (`electron` for Linux, not `electron.exe`).
  - If switching OS, delete `node_modules` and reinstall dependencies.
- **Dev server errors:**
  - For development, run both `npm start` (React) and `npm run electron` (Electron).
  - For production, build React and run Electron without the dev server.

---

## 📦 Directory Structure
- `public/` — Static assets, manifest, icons
- `electron/` — Electron main process, Linux icon
- `src/` — React app source code

---

## 📄 License
MIT