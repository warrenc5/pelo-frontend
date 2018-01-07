#!/bin/bash 
if [[ $CORDOVA_CMDLINE =~ release ]] ; then
echo "uploading release "
	"/Applications/Xcode.app/Contents/Applications/Application Loader.app/Contents/Frameworks/ITunesSoftwareService.framework/Versions/A/Support/altool" --validate-app -f `find . -name \*.ipa` -u wozza.xing@gmail.com -p @keychain:idmsa.apple.com
	"/Applications/Xcode.app/Contents/Applications/Application Loader.app/Contents/Frameworks/ITunesSoftwareService.framework/Versions/A/Support/altool" --upload-app -f `find . -name \*.ipa` -u wozza.xing@gmail.com -p @keychain:idmsa.apple.com
fi
