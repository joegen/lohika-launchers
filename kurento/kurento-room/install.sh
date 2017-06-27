#!/usr/bin/env sh
shdir=$(dirname "$(readlink -f "$0")")
cd $shdir && rm -fr app && mkdir app && cd ../source/kurento-room
# git clone https://github.com/Kurento/kurento-room.git
# cd kurento-room
# checkout the latest tag
# git pull
git checkout $(git describe --abbrev=0 --tags)
git submodule update --init --recursive
mvn clean package -am -pl kurento-room-demo -DskipTests
cd kurento-room-demo/target
unzip kurento-room-demo-6.6.0.zip -d $shdir/app

