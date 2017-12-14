#ssh pulse 'cd /Users/wozza/pelo-react/ && git fetch && test `git rev-parse HEAD` != `git rev-parse @{u}` && git checkout . && git pull --no-commit && NODE_ENV=development /bin/bash -i -c "gulp ios-run"'
rsync -vur cordova/plugins/cordova-plugin-mapbox wozza@pulse:pelo-react/cordova/plugins
rsync -vur src/ wozza@pulse:pelo-react/
rsync -vu gulpfile.js package.json wozza@pulse:pelo-react/
ssh -X -t wozza@pulse 'cd pelo-react/ && security unlock-keychain /Users/wozza/Library/Keychains/login.keychain && bash -i -c "PATH=/usr/local/bin:$PATH NODE_ENV=development /usr/local/bin/gulp ios-run"'
