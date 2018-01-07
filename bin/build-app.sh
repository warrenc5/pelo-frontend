cd ~/$1
git checkout $2
git fetch 
test `git rev-parse HEAD` != `git rev-parse @{u}` 
git checkout -- . 
git pull --no-commit 
. ~/.nvm/nvm.sh 
npm i 
NODE_ENV=$3 /bin/bash -i -c "gulp release $4"
chmod o+r /var/www/html/*

