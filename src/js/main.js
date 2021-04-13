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

//Load useragent
var chromiumVersion = process.versions.chrome
const getUserAgent = require(appdir + '/js/userAgent.js')
fakeUserAgent = getUserAgent(chromiumVersion)

var contrib = require(appdir + '/contributors.json') // Read contributors.json
var packageJson = require(app.getAppPath() + '/package.json') // Read package.json

// "About" information
var appAuthor = packageJson.author
var appRepo = packageJson.appRepo

if (Array.isArray(contrib.contributors) && contrib.contributors.length) {
	var appContributors = [ appAuthor, ...contrib.contributors ]
} else {
	var appContributors = [appAuthor]
}

var appYear = '2021' // the year since this app exists
var currentYear = new Date().getFullYear()
var stringContributors = appContributors.join(', ')

// Year format for copyright
if (appYear == currentYear){
	var copyYear = appYear
} else {
	var copyYear = `${appYear}-${currentYear}`
}

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
            },

            { type: 'separator' },
	    { label: 'about', role: 'about', click: function() { app.showAboutPanel();;}},
	    { label: 'quit', role: 'quit', click: function() { app.quit();;}}
         ]
  let trayMenu = Menu.buildFromTemplate(trayMenuTemplate)
  tray.setContextMenu(trayMenu)
  
  const aboutWindow = app.setAboutPanelOptions({
	applicationName: appname,
	iconPath: icondir + '/tray-small.png',
	applicationVersion: 'version: ' + appversion,
	authors: appAuthor,
	website: appRepo,
	credits: 'credits: ' + stringContributors,
	copyright: 'Copyright © ' + copyYear + ' ' + appAuthor
  })
  return aboutWindow
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
    mainWindow.loadURL(config.view.url, {userAgent: fakeUserAgent});
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
