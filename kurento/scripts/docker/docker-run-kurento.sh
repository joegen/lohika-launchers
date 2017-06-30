#!/usr/bin/env sh
docker run --rm --net=host --network=kurento-network -e GST_DEBUG=Kurento*:5 -it -p 8888:8888 -p 3478:3478 -v /home/earljann/data/kurento:/usr/local/lohika/data --name=kms-01 274425231303.dkr.ecr.us-east-1.amazonaws.com/lohika npm run --prefix /usr/local/lohika/data launch-app 
