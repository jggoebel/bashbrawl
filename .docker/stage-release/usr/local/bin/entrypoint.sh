#!/bin/sh

# check all args for the insecure flag
if [ "${*#*--insecure}" = "$*" ]; then
    HF_SERVER=https://$HF_SERVER
else
    HF_SERVER=http://$HF_SERVER
fi

sed -i'' "s|#####HF_SERVER#####|$HF_SERVER|g;" /usr/share/nginx/html/main*.js*

echo "Configured with HF_SERVER=$HF_SERVER"

nginx -g 'daemon off;' # overriding nginx default startup
