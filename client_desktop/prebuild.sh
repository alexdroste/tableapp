#!/usr/bin/env bash 

echo "* removing old app files"
rm -R app
echo "* building client (call build script in ../client/)"
(cd ../client/ && yarn build)
echo "* client built"
echo "* copy ../client/build => ./app"
cp -R ../client/build app
