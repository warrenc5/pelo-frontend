echo 'dealpha'
find platforms/ios/Pelo/Images.xcassets/ -name "*.png" -exec convert "{}" -alpha off "{}" \;
