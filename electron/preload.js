// electron/preload.js
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require('electron');

// Expose only safe APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  setFocusTimerActive: (isActive) => ipcRenderer.send('set-focus-timer-active', isActive),
  saveData: (filename, data) => ipcRenderer.invoke('save-data-to-json', filename, data),
  loadData: (filename) => ipcRenderer.invoke('load-data-from-json', filename),
});