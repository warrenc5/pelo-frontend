npm install -g jashkenas/coffeescript
npm install -g gulp
npm install -g cordova

npm install --save-dev 
cd cordova && cordova add platform android && cordova prepare
gulp compile
