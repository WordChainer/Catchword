#!/bin/bash

if [[ -z $(pgrep mongod) ]]; then
    cd $(dirname $(realpath "$0"))
    sudo service mongod start
    sudo FORCE_COLOR=1 pm2 start
fi
