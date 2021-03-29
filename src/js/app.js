const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const fs = require('fs')
const path = require('path')
const appConfig = new require('electron-json-config')
var deepmerge = require('deepmerge')

/*    Get current app dir – also removes the need of importing icons
    manually to the electron package dir. */

const appDir = app.getAppPath()
const config = require(`${appDir}/src/configs/config.json`)

/*    Check if we are using the packaged version.
    This also fixes for "About" icon (that can't be loaded with the electron
    when it is packaged in ASAR) */

if (appDir.indexOf("app.asar") < 0) {
    var appIconDir = `${appDir}/icons`
} else {
    var appIconDir = process.resourcesPath
}

var packageJson = require(`${appDir}/package.json`) // Read package.json
var ContributorsJson = require(`${appDir}/src/configs/contributors.json`) // Read contributors.json

// Load scripts:
const getUserAgent = require(`${appDir}/src/js/userAgent.js`)
const getMenu = require(`${appDir}/src/js/menus.js`)

// Load string translations:
function loadTranslations() {
    var systemLang = app.getLocale()
    var localStrings = `src/lang/${systemLang}/strings.json`
    var globalStrings = require(`${appDir}/src/lang/en-GB/strings.json`)
    if(fs.existsSync(path.join(appDir, localStrings))) {
        var localStrings = require(`${appDir}/src/lang/${systemLang}/strings.json`)
        var l10nStrings = deepmerge(globalStrings, localStrings)
    } else {
        var l10nStrings = globalStrings // Default lang to english
    }
    return l10nStrings
}

// Vars to modify app behavior
var appURL = config.view.url
var appIcon = `${appIconDir}/app.png`
var appTrayIcon = `${appIconDir}/tray.png`
//var appTrayPing = `${appIconDir}/tray-ping.png`
var appTrayIconSmall = `${appIconDir}/tray-small.png`
var winWidth = 1000
var winHeight = 600

//"About" information
var appFullName = app.getName()
var appVersion = packageJson.version;
var appAuthor = packageJson.author.name
var appYear = '2021' // the year since this app exists
var appRepo = packageJson.homepage;
var chromiumVersion = process.versions.chrome

/* Remember to add yourself to the contributors array in the contributors.json
   if you're improving the code of this application */

if (Array.isArray(ContributorsJson.contributors) && ContributorsJson.contributors.length) {
    var appContributors = [ appAuthor, ...ContributorsJson.contributors ]
} else {
    var appContributors = [appAuthor]
}

let mainWindow;

// "About" Panel:
function aboutPanel() {
    l10nStrings = loadTranslations()
    const aboutWindow = app.setAboutPanelOptions({
        applicationName: appFullName,
        iconPath: appIcon,
        applicationVersion: `v${appVersion}`,
        authors: appContributors,
        website: appRepo,
        credits: `${l10nStrings.help.contributors} ${stringContributors}`,
        copyright: `Copyright © ${copyYear} ${appAuthor}\n\n${l10nStrings.help.credits}`
    })
    return aboutWindow
}

mainWindow.on('closed', function () {
  mainWindow = null;
});

mainWindow.once('ready-to-show', () => {
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('ready', function () {
  aboutWindow = aboutPanel()
  var mainWindow = new BrowserWindow({
    width: winWidth,
    height: winHeight
  })

  if (config.mode === "url") {
    console.log('Url: True')
    mainWindow.loadURL(config.view.url)
  } else if (config.mode === "file") {
    console.log('Url: False')
    mainWindow.loadFile(config.view.file)
  } else {
    console.log('Url: Error')
    mainWindow.loadFile('error.html')
  }

  if (config.devmode === "true") {
    console.log('Dev mode: True')
    mainWindow.openDevTools()
  } else if (config.devmode === "false") {
    console.log('Dev mode: False')
  } else {
    console.log('Dev Mode: Error')
  }

  if (!singleInstance) {
    app.quit()
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (mainWindow){
            if(!mainWindow.isVisible()) mainWindow.show()
            if(mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
  });

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});
