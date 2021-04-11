const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const notifier = require('node-notifier');
const url = require('url');
const path = require('path');

var appdir = path.join(app.getAppPath(), '/src');
var icondir = path.join(appdir, '/icons');
var appname = app.getName();
var appversion = app.getVersion();
const config = require(appdir + '/config.json');

console.log('appname: ' + appname);
console.log('appversion: ' + appversion);
console.log('appdir: ' + appdir);
console.log('icondir: ' + icondir);

function notification(mode) {
  if (mode == "1") {
    notifier.notify({
        title: 'Update availible.',
        message: 'An update is availible, click here to update.',
        icon: icondir + '/updateavil.png',
        sound: true,
        wait: true
      },
      function (err, response1) {
        if (response1 == "activate") {
          console.log("User wants to update, shutting down app...");
          app.quit();
        }
      }
    );
  } else if (mode == "2") {
    notifier.notify({
        title: 'Update downloaded.',
        message: 'An update has been downloaded, click here to update.',
        icon: icondir + '/updatedown.png',
        sound: true,
        wait: true
      },
      function (err, response) {
        if (response == "activate") {
          console.log("User wants to update, shutting down app...");
          app.quit();
        }
      }
    );
  }
}

let mainWindow;
let tray;

// Don't show the app in the doc
app.dock.hide()

const createTray = () => {
  tray = new Tray(path.join(icondir, '/tray-icon.png'))
  const trayMenuTemplate = [
            {
               label: appname,
               enabled: false
            },
            
            {
               label: 'Version: ' + appversion,
               enabled: false
            },

            {
               label: 'Made by: ' + config.contrib,
               enabled: false
            }
         ]
  let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
  tray.setContextMenu(trayMenu)
}

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1040,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  if (config.view.mode == "file") {
    mainWindow.loadFile(appdir + '/view/index.html');
  } else if (config.view.mode == "url") {
    mainWindow.loadURL(config.view.url);
  } else {
    console.log("Error: Unknown mode given at config.view.mode");
  }
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.on('ready', () => {
  createWindow();
  createTray()
});

app.on('window-all-closed', function () {
  //Remove macos detection
  //if (process.platform !== 'darwin') {
    app.quit();
  //}
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  //mainWindow.webContents.send('update_available');
  notification(1)
});

autoUpdater.on('update-downloaded', () => {
  //mainWindow.webContents.send('update_downloaded');
  notification(2)
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
