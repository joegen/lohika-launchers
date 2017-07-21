#!/usr/bin/env sh
shdir=$(dirname "$(readlink -f "$0")")
cd $shdir && rm -fr app && mkdir app && cd ../source/tryit-jssip
# git clone https://github.com/Kurento/kurento-room.git
# cd kurento-room
# checkout the latest tag
# git pull
git checkout $(git describe --abbrev=0 --tags)
git submodule update --init --recursive
npm install
npm install -g gulp-cli
gulp prod 
cp -R out/ $shdir/app/tryit-jssip

