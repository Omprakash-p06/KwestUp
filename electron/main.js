const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

// Make isFocusTimerActive accessible everywhere
let isFocusTimerActive = false;

// Optional: Install electron-is-dev for easier development setup
// npm install electron-is-dev

// Main function to create the Electron window
function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 600,
    minHeight: 500,
    icon: path.join(__dirname, 'assets/icon.ico'),
    frame: false, // Remove default OS window controls and title bar
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // Security: do not expose Node.js in renderer
      contextIsolation: true, // Security: isolate context
      webSecurity: !isDev,
    },
  });

  // Load the React app
  // In development, load from localhost. In production, load from the built HTML file.
  win.loadURL(
    isDev
      ? 'http://localhost:3000' // Your React dev server URL (e.g., from npm start)
      : `file://${path.join(__dirname, '..', 'index.html')}`
  );

  // Open DevTools in development mode
  if (isDev) {
    win.webContents.openDevTools();
  }

  // IPC listener from renderer process (React app) to main process
  ipcMain.on('set-focus-timer-active', (event, isActive) => {
    isFocusTimerActive = isActive;
    win.setClosable(!isActive);
    win.setMinimizable(!isActive);
    win.setMaximizable(!isActive);
  });

  // Intercept window close event
  win.on('close', (e) => {
    if (isFocusTimerActive) {
      e.preventDefault();
      dialog.showMessageBox(win, {
        type: 'warning',
        title: 'Focus Mode Active',
        message: 'You are in a focus session. Please complete or reset the timer before closing the application.',
        buttons: ['OK']
      });
    }
  });

  // You might also want to try to prevent task manager access, but this is highly OS-dependent
  // and generally not recommended for user experience.
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// --- Window Control IPC Handlers ---
// Handle window control actions from the renderer process

ipcMain.handle('window-control', async (event, action) => {
  const win = BrowserWindow.getFocusedWindow();
  if (!win) return { success: false, error: 'No focused window' };

  try {
    switch (action) {
      case 'close':
        // Check if focus timer is active before closing
        if (isFocusTimerActive) {
          const result = await dialog.showMessageBox(win, {
            type: 'warning',
            title: 'Focus Mode Active',
            message: 'You are in a focus session. Are you sure you want to close the application?',
            buttons: ['Cancel', 'Close Anyway'],
            defaultId: 0,
            cancelId: 0
          });
          if (result.response === 0) return { success: false, cancelled: true };
        }
        win.close();
        break;
      case 'minimize':
        win.minimize();
        break;
      case 'maximize':
        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
        break;
      default:
        return { success: false, error: 'Invalid action' };
    }
    return { success: true };
  } catch (error) {
    console.error('Window control error:', error);
    return { success: false, error: error.message };
  }
});

// --- IPC for local JSON file operations (for native file I/O) ---
// This is where you'd implement the actual file I/O for JSON files
// instead of localStorage, in a native Electron app.
// This would replace the localStorage logic in your React app.

// Example: Save data
ipcMain.handle('save-data-to-json', async (event, filename, data) => {
  const fs = require('fs');
  const appDataPath = app.getPath('userData'); // Get app-specific data directory
  const filePath = path.join(appDataPath, filename);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    console.error("Failed to save data:", error);
    return { success: false, error: error.message };
  }
});

// Example: Load data
ipcMain.handle('load-data-from-json', async (event, filename) => {
  const fs = require('fs');
  const appDataPath = app.getPath('userData');
  const filePath = path.join(appDataPath, filename);
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return { success: true, data: JSON.parse(data) };
    }
    return { success: true, data: null }; // File doesn't exist yet
  } catch (error) {
    console.error("Failed to load data:", error);
    return { success: false, error: error.message };
  }
});