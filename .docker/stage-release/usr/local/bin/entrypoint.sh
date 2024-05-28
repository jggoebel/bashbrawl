#!/bin/sh

sed -i'' "s|#####SERVER#####|$SERVER|g;" /usr/share/nginx/html/main*.js*

echo "Configured with SERVER=$SERVER"

nginx -g 'daemon off;' # overriding nginx default startup
