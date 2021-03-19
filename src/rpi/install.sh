#!/bin/bash

#Functions
function error {
  echo -e "\e[91m$1\e[39m"
  exit 1
}

#Main

#Update apt
#sudo apt update || error "Unable to run apt update!"
#Install libwidevinecdm0
#sudo apt -fy install libwidevinecdm0 || error "Unable to install libwidevinecdm0!"

#Checking if using armv6
if [ ! -z "$(cat /proc/cpuinfo | grep ARMv6)" ];then
  error "armv6 cpu not supported"
fi

if ! command -v curl >/dev/null ; then
  echo -e "\033[0;31mcurl: command not found.\e[39m
You need to install curl first. If you are on a debian system, this command should install it:
\e[4msudo apt install curl\e[0m"
  exit 1
fi

#Install nvm manager:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash || error "Failed to install nvm!"
#source ~/.bashrc
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

#Install NodeJS:
nvm install node || error "unable to install nodejs!"

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
