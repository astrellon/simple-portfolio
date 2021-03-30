#!/usr/bin/env bash

set -e
set -o pipefail

rm -rf ./portfolio-tmp
mkdir ./portfolio-tmp

git clone --depth=1 --branch "$1" "$2" ./portfolio-tmp

rm -rf ./data
rm -rf ./assets

mv ./portfolio-tmp/data ./data
mv ./portfolio-tmp/assets ./assets

rm -rf ./portfolio-tmp