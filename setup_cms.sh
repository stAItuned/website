#!/bin/bash
cd cms
git pull
cd ../static/assets/
ln -s -f ../../cms/ cms