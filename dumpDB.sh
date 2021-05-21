mongodump -d admin --gzip --archive > /home/ubuntu/Catchword/backup/`date -d "9 hours" +"%Y%m%d_%H%M%S".gz`
