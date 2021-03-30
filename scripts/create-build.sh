#!/usr/bin/env bash

set -e
set -o pipefail

ROOT=$(cd `pwd`/.. ; pwd)
DEPLOY=$ROOT/deploy
SERVER=$ROOT/server
SCRIPTS=$ROOT/scripts

rm -rf $DEPLOY
mkdir $DEPLOY

pushd $SERVER
npm run buildClient
popd

#cp -rf $SERVER/* $DEPLOY
rsync -av $SERVER/* $DEPLOY --exclude assets --exclude data --exclude .cache --exclude node_modules

pushd $DEPLOY
tar -zcvf $SCRIPTS/server.tar.gz *
popd