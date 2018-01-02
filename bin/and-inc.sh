if [ "$1" == "dev" ] ; then
F="pelo-armv7-debug.apk"
elif [ "$1" == "prod" ] ; then
F="pelo-armv7-release.apk"
fi

wget -nc -p -O /tmp/${F} http://dev.testpelo1.cc/${F}

if [ -s /tmp/${F} ] ; then
adb install -r /tmp/${F}
else 
rm /tmp/${F}
fi

