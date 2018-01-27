if [[ $CORDOVA_CMD =~ /release/ ]] ; then 
xcrun xcodebuild -scheme Pelo -configuration Release archive -archivePath platforms/ios/Pelo.xcarchive
else
echo "NOT EXPORTED"
fi
