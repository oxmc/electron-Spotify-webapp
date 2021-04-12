#!/bin/bash

#Functions
function error {
  echo -e "\e[91m$1\e[39m"
  exit 1
}

function warning {
  echo -e "\e[91m$2\e[39m"
  sleep "$1"
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

cd $HOME

if ! command -v curl >/dev/null ; then
  echo -e "\033[0;31mcurl: command not found.\e[39m
You need to install curl first. If you are on a debian system, this command should install it:
\e[4msudo apt install curl\e[0m"
  exit 1
fi

if ! command -v node >/dev/null ; then
  node=1
else
  node=0
fi

if [ "$node" == 1 ]; then
  #Install nvm manager:
  wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash || error "Failed to install nvm!"
  source ~/.bashrc
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
  
  #Install NodeJS:
  nvm install node || error "unable to install nodejs!"
  
  #Add nodesource repo
  #curl -sL https://deb.nodesource.com/setup_10.x | sudo bash -
  #Install Nodejs
  #sudo apt install nodejs || error "unable to install nodejs!"
fi

if [ -d electron-Spotify-webapp ]; then
  while true; do
    read -p "the 'electron-Spotify-webapp' folder already exists, do you want to update it ('git pull') [y/n]?" answer
    if [ "$answer" =~ [yY] ]; then
      warning "5" "are you sure? you might delete your modifications!\nPress [CTRL+C] in the next 5 seconds to cancel."
      cd $HOME/electron-Spotify-webapp/ || error "unable to change directory to '$(pwd)/electron-Spotify-webapp'!"
      git reset --hard || error "Failed to run 'git reset --hard'!"
      git fetch || error "Failed to run 'git fetch'!"
      git pull || error "Failed to run 'git pull'!"
      break
    elif [ "$answer" =~ [nN] ]; then
      echo "OK"
      break
    else
      warning 0 "'$answer' is a invalid answer! please try again."
    fi
  done
else
  #Clone this repo
  git clone https://github.com/oxmc/electron-Spotify-webapp || error "Unable to clone repo!"
fi

cd $HOME

#cd into repo
cd electron-Spotify-webapp || error "Failed to change directory to '$(pwd)/electron-Spotify-webapp/'!."
#Run npm install
npm install  || error "Unable to install required npm packages to run Spotify-webapp!"

#Create menu shortcuts
#menu button
if [ ! -f ~/.local/share/applications/Spotify-webapp.desktop ];then
  echo "Creating menu button..."
  mkdir -p ~/.local/share/applications
  echo "[Desktop Entry]
  Name=Spotify
  Comment=A webapp of Spotify made for the raspberry pi
  Exec=npm start
  Path=${HOME}/electron-Spotify-webapp/
  Icon=${HOME}/electron-Spotify-webapp/icons/app.png
  Terminal=false
  Type=Application
  Categories=Utility;" > ~/.local/share/applications/Spotify-webapp.desktop
fi

if [ ! -f ~/Desktop/Spotify.desktop ];then
  echo "Adding Desktop shortcut..."
  cp -f ~/.local/share/applications/Spotify-webapp.desktop ~/Desktop/Spotify.desktop
  chmod +x ~/Desktop/Spotify.desktop
fi

#Inform user procces finished
echo "Finished!"
exit 0
