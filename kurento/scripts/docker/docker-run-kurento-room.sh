#!/usr/bin/env sh
docker run --rm --net=host --network=kurento-network -it -p 8080:8080 -p 8443:8443 -v /home/earljann/data/kurento-room:/usr/local/lohika/data --name=kurento-room-01 274425231303.dkr.ecr.us-east-1.amazonaws.com/lohika npm run --prefix /usr/local/lohika/data launch-app
