#!/bin/bash

#Functions
function error {
  echo -e "\e[91m$1\e[39m"
  exit 1
}

#Main

#Update apt
sudo apt update || error "Unable to update apt!"
#Update system
sudo apt full-upgrade || error "Unable to update system!"
#Install libwidevinecdm0
sudo apt install libwidevinecdm0 || error "Unable to install libwidevinecdm0!"
#Install nodejs
sudo apt install nodejs || error "Unable to install nodejs!"

#Clone this repo
git clone https://github.com/oxmc/electron-Spotify-webapp || error "Unable to clone repo!"
#cd into repo
cd electron-Spotify-webapp || error "Unable to cd into directory, the folder may not exist."
#Run npm install
npm install || error "Unable to installed required npm packages to run Spotify-webapp!"

#Create menu shortcuts
#menu button
if [ ! -f ~/.local/share/applications/Spotify-webapp.desktop ];then
  echo "Creating menu button..."
fi
mkdir -p ~/.local/share/applications
echo "[Desktop Entry]
Name=Spotify
Comment=A webapp of Spotify made for the raspberry pi
Exec=${DIRECTORY}/npm start
Icon=${DIRECTORY}/icons/app.png
Terminal=false
Type=Application
Categories=Utility;" > ~/.local/share/applications/Spotify-webapp.desktop

if [ ! -f ~/Desktop/Spotify.desktop ];then
  echo "Adding Desktop shortcut..."
fi
cp -f ~/.local/share/applications/Spotify-webapp.desktop ~/Desktop/Spotify.desktop
chmod +x ~/Desktop/Spotify.desktop

#Inform user procces finished
echo "Finished!"
