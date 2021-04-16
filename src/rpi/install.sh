#!/bin/bash

#Variables
repo="https://github.com/oxmc/electron-Spotify-webapp"
appdir="electron-Spotify-webapp"
clonename=""
appname="Spotify-webapp"
branch="-b dev-stable"

fwe=""
ers=""

#Functions
function error {
  echo -e "\e[91m$1\e[39m"
  if [ "$2" == "exit" ]; then
    exit 1
  else
    fwe="1"
    ers+="$1"
  fi
}

function warning {
  echo -e "\e[91m$2\e[39m"
  sleep "$1"
}

#Main
#Check if using armv6 cpu
if [ ! -z "$(cat /proc/cpuinfo | grep ARMv6)" ];then
  error "armv6 cpu not supported"
fi

cd $HOME

if ! command -v node >/dev/null ; then
  node=1
  echo "installed" > ~/$appdir/status 
else
  node=0
fi

if [ "${node}" == 1 ]; then
  #Install nvm manager:
  wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash || error "Failed to install nvm!"
  source ~/.bashrc
  export NVM_DIR="$HOME/.nvm"
  [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
  [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
  
  #Install NodeJS:
  nvm install node || error "unable to install nodejs!"
fi

if [ -d '$HOME/${appdir}' ]; then
  while true; do
    read -p "the '$appdir' folder already exists, do you want to update it ('git pull') [y/n]? " answer
    if [[ "${answer}" =~ [yY] ]]; then
      warning "5" "are you sure? you might delete your modifications!\nPress [CTRL+C] in the next 5 seconds to cancel."
      cd $HOME/$appdir/ || error "unable to change directory to '$(pwd)/$appdir'!"
      git reset --hard || error "Failed to run 'git reset --hard'!"
      git fetch || error "Failed to run 'git fetch'!"
      git pull || error "Failed to run 'git pull'!"
      break
    elif [[ "${answer}" =~ [nN] ]]; then
      echo "OK, exiting now..."
      exit 0
    else
      warning 0 "'$answer' is a invalid answer! please try again."
    fi
  done
else
  #Clone this repo
  git clone $repo $clonename $branch || error "Unable to clone repo!" "exit"
fi

cd $HOME

#cd into repo
cd $appdir || error "Failed to change directory to '$(pwd)/$appdir/'!"
#Run npm install
npm install  || error "Unable to install required npm packages to run $appname!"

#Create menu shortcuts
#menu button
if [ ! -f ~/.local/share/applications/Spotify-webapp.desktop ];then
  echo "Creating menu button..."
  mkdir -p ~/.local/share/applications || error "Unable to create $(HOME)/.local/share/applications !"
  echo "[Desktop Entry]
  Name=Spotify
  Comment=A webapp of Spotify made for the raspberry pi
  Exec=npm start
  Path=${HOME}/electron-Spotify-webapp/
  Icon=${HOME}/electron-Spotify-webapp/icons/app.png
  Terminal=false
  Type=Application
  Categories=Utility;" > ~/.local/share/applications/Spotify-webapp.desktop
  if [ ! -f ~/.local/share/applications/Spotify-webapp.desktop ]; then
    error "menu shortcut was unable to be created!"
  fi
fi

if [ ! -f ~/Desktop/Spotify.desktop ];then
  echo "Adding Desktop shortcut..."
  cp -f ~/.local/share/applications/Spotify-webapp.desktop ~/Desktop/Spotify.desktop || error "Unable to create Desktop shortcut!"
  chmod +x ~/Desktop/Spotify.desktop || error "Unable to change file permissons for '$(HOME)/Desktop/Spotify.desktop'!"
  if [ ! -f ~/Desktop/Spotify.desktop ]; then
    error "Desktop shortcut was unable to be created!"
  fi
fi

#Inform user that the install has finished
#Check if finished with errors
if [ "${fwe}" == "1" ]; then
  echo "This script finished with errors, Here are the errors: ${ers}"
  exit 1
elif [ "${fwe}" == "0" ]; then
  echo "Finished!"
  exit 0
fi
