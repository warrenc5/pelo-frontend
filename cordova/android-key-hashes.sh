keytool -exportcert --storepass android -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
keytool -exportcert -alias pelo -keystore ./pelo.jks --storepass 123456 --keypass 123456 | openssl sha1 -binary | openssl base64
