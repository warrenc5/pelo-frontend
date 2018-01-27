if [[ $CORDOVA_CMDLINE =~ release ]] ; then 
xcrun xcodebuild -scheme Pelo -configuration Release archive -archivePath platforms/ios/Pelo.xcarchive
else
echo "NOT ARCHIVED **********8"
fi
