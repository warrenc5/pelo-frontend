"refresh": "gulp compile && cd cordova && cordova compile && adb -e install -r platforms/android/build/outputs/apk/android-debug.apk && adb shell am start -a android.intent.action.MAIN -n devnull.Pelo/devnull.Pelo.MainActivity  "
  
TODOs

change the output name of the apk file to pelo-android
npm install jade-strip-comments
add last git commit to the console log

split out bundle.js into multiple files. - later

https://docs.gradle.org/current/userguide/userguide.html
