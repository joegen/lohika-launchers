#!/usr/bin/env sh
node_paths=/usr/local/lib/node/lohika/launcher/lib:/usr/local/lib/node/lohika/launcher/node_modules/
shdir=$(dirname "$(readlink -f "$0")")
script="$shdir/lib/lohikalauncher-redis.js"
configdir="$shdir/conf"
fileIn="$configdir/redis.conf.json"
fileOut="$configdir/redis.conf"
NODE_PATH=$node_paths DEBUG=* node $script -i $fileIn -o $fileOut
