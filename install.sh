npm install -g jashkenas/coffeescript
npm install -g gulp
npm install -g cordova

npm install --save-dev 
npm install --save-dev -g react-dom react react-tap-event-plugin material-ui
cd cordova && cordova add platform android && cordova prepare
gulp compile
