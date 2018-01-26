cd ~/$1
git checkout $2
git fetch 
echo "ha! " + $5

test `git rev-parse HEAD` != `git rev-parse @{u}` || test -n "$5" || exit 1

git checkout -- . 
git pull --no-commit 
. ~/.nvm/nvm.sh 
rm package-lock.json cordova/package-lock.json
npm i 
rm package-lock.json cordova/package-lock.json
NODE_ENV=$3 /bin/bash -i -c "gulp release --platform $4"
chmod o+r /var/www/html/*

