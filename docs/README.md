<h1><a href='https://spotify.com'><img src='../src/icons/app.png' width='64px'></a> Electron Spotify Web App </h1>

[![MIT license](https://img.shields.io/badge/License-MIT-C23939.svg)](COPYING)
[![Electron](https://img.shields.io/badge/Made%20with-Electron-486F8F.svg)](https://www.electronjs.org/)
[![GitHub release](https://img.shields.io/github/release/oxmc/electron-Spotify-webapp.svg)](../../../tags)
[![Github downloads](https://img.shields.io/github/downloads/oxmc/electron-Spotify-webapp/total.svg)](../../../releases)
[![PRs Welcome](https://img.shields.io/badge/Pull%20requests-welcome-brightgreen.svg)](#want-to-contribute-to-my-project)
[![Pi-Apps badge](https://badgen.net/badge/Pi-Apps%3F/No/c51a4a?icon=https://gitcdn.link/repo/Botspot/pi-apps/master/icons/logo.svg)](https://github.com/Botspot/pi-apps)
<!--[![Run tests](../../../actions/workflows/build.yml/badge.svg?event=push)](../../../actions/workflows/build.yml)-->

A Spotify Web App made with the [Electron API](https://github.com/electron/electron).

## To install
```
wget -qO- https://raw.githubusercontent.com/oxmc/electron-Spotify-webapp/dev-stable/src/rpi/install.sh | bash
```
The install script ensures node is installed, and creates two menu buttons.

<details>
<summary><b>To install manually</b> if you prefer to see what happens under the hood</summary>
```
git clone -b dev-stable https://github.com/oxmc/electron-Spotify-webapp
bash ~/electron-Spotify-webapp/src/rpi/install.sh
```
</details>

<details>
<summary><b>To uninstall</b></summary>
```
~/electron-Spotify-webapp/src/rpi/uninstall.sh
```
</details>
<!--
# Windows

Here is the main window, (on `TwisterOS` using `MacOS Big Sur theme`)

![Main window on TwisterOS](./assets/spotify-webapp-main-window-3.png)


Here is the version window, (on `TwisterOS` using `MacOS Big Sur theme`)

![Version window on TwisterOS](./assets/spotify-webapp-version-window-2.png)
-->
