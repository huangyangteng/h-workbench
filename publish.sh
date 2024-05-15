#/bin/bash

rm -rf piracy-geek
npm run build

mv dist piracy-geek

LOCAL_DIR=piracy-geek/
SERVER=root@43.136.216.240:/root/webapps/piracy-geek
rsync -v   --progress --stats -r -t -p -l -z -e 'ssh -p 22' --delete  $LOCAL_DIR  $SERVER
