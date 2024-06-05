#!/bin/sh

sed -i'' "s|#####SERVER#####|$SERVER|g;" /usr/share/nginx/html/main*.js*
sed -i'' "s|#####IMPRINT#####|$IMPRINT|g;" /usr/share/nginx/html/main*.js*
sed -i'' "s|#####PRIVACY#####|$PRIVACY|g;" /usr/share/nginx/html/main*.js*

echo "Configured with SERVER=$SERVER amd IMPRINT=$IMPRINT and PRIVACY=$PRIVACY"

nginx -g 'daemon off;' # overriding nginx default startup
