# nfc

nfc is an interface for reading and writing Amiibo bin files to NFC tags, written in node.js for ultimate speed and power.

## Install Nodejs 12 LTS

    sudo npm install n -g
    sudo n lts
    node --version
    
## Install pccscd

    sudo apt-get install pcscd
    
## Install amiitool

    git clone --recursive https://github.com/socram8888/amiitool
    cd amiitool && make && sudo cp amiitool /usr/local/bin/amiitool
    
## Build nfc and react webui

    git clone https://github.com/dongrote/nfc
    cd nfc
    npm build-and-install
    export AMIIBO_DIRECTORY=/path/to/amiibos # where your amiibo bin files are, no other files should be in this directory
    export DEBUG=*:error,*:info              # to get stack traces if things go wrong
    export AMIITOOL_KEY_SET_FILE_PATH=/path/to/unfixed-fixed-keys.bin #path to crypto key, exercise left up to the reader on where to get it
    npm start
  
You should now be able to navigate to port 3000 to see a web interface for programming NFC tags with Amiibos!
