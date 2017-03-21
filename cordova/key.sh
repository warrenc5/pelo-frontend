PASSWORD=123456
KEYSTORE=pelo.jks

#rm ${KEYSTORE}
keytool -v -genkeypair -alias pelo -keystore ${KEYSTORE} -keyalg RSA -keysize 2048 -dname "CN=Pelo, OU=Pelo, O=p, L=p, ST=p, C=p" -storepass ${PASSWORD} -storetype jks
keytool -v -certreq -alias pelo -keystore ${KEYSTORE} -storepass ${PASSWORD} -file certreq
keytool -v -gencert -keystore ${KEYSTORE}  -infile certreq  -alias pelo -outfile cert -storepass ${PASSWORD}
keytool -v -importcert -file cert -keystore ${KEYSTORE} -storepass ${PASSWORD} -alias pelo_self
keytool -list -keystore ${KEYSTORE} -storepass ${PASSWORD}
