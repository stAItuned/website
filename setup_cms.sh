#!/bin/bash
if [ -d ./cms ]; then
    cd cms
    git pull
    cd ..
else 
    git clone https://github.com/stAItuned/content-manager.git cms 
fi
cd ./static/assets/
ln -s -f ../../cms/ cms
