#!/usr/bin/env sh
node_paths=/usr/local/lib/node/lohika/launcher/lib:/usr/local/lib/node/lohika/launcher/node_modules/
shdir=$(dirname "$(readlink -f "$0")")
script="$shdir/lib/lohikalauncher-tryit-jssip-nginx.js"
configdir="$shdir/conf"
fileIn="$configdir/tryit-jssip-nginx.conf.json"
fileOut="$configdir/tryit-jssip-nginx.conf"
NODE_PATH=$node_paths DEBUG=* node $script -i $fileIn -o $fileOut
