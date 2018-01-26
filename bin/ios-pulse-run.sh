#rsync -vur cordova/plugins/cordova-plugin-mapbox wozza@pulse:pelo-react/cordova/plugins
#rsync -vur cordova/Mapbox/* wozza@pulse:pelo-react/cordova/plugins/cordova-plugin-mapbox/
rsync -vur bin wozza@pulse:pelo-react/bin
rsync -vur src wozza@pulse:pelo-react/src
rsync -vu gulpfile.js package.json wozza@pulse:pelo-react/
#ssh -X -t wozza@pulse 'cd ~/pelo-react/ && git fetch && test `git rev-parse HEAD` != `git rev-parse @{u}` && git checkout . && git pull --no-commit && security unlock-keychain /Users/wozza/Library/Keychains/login.keychain && NODE_ENV=development /bin/bash -i -c "gulp ios-run"'
ssh -X -t wozza@pulse 'security unlock-keychain /Users/wozza/Library/Keychains/login.keychain && ~/pelo-react/bin/build-app.sh pelo-react develop development ios-run true' 
