#!/usr/bin/env sh
node_paths=/usr/local/lib/node/lohika/launcher/lib:/usr/local/lib/node/lohika/launcher/node_modules/
shdir=$(dirname "$(readlink -f "$0")")
script="$shdir/lib/lohikalauncher-kurento.js"
configdir="$shdir/conf"
webrtccfg="$configdir/WebRtcEndPoint.conf.json"
maincfg="$configdir/kurento.conf.json"
NODE_PATH=$node_paths DEBUG=* node $script -m $maincfg -w $webrtccfg
