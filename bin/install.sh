npm install -g gulp
npm install gulp-run
npm install -g cordova
npm install -g jashkenas/coffeescript
npm install -g npm-check-updates

npm install --save-dev 
npm install --save-dev -g react-dom react react-tap-event-plugin material-ui
cd cordova && cordova add platform android && cordova prepare
gulp compile
