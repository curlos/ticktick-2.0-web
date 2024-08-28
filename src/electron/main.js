import { app, BrowserWindow } from 'electron';

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1400,
    height: 732,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  // mainWindow.loadFile('public/index.html')
  // OR for React apps, point to localhost if in development
  mainWindow.loadURL('http://localhost:5173');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(createWindow);
