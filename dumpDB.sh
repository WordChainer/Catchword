#!/bin/bash

FOLDER_PATH="$(dirname $(realpath "$0"))/backup/"

mongodump -d admin --gzip --archive > "$FOLDER_PATH$(date -d "9 hours" +"%Y%m%d_%H%M%S".gz)"
find "$FOLDER_PATH" -type f -mtime +7 -name '*.gz' -execdir rm -- '{}' \;
