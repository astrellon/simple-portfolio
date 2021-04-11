#!/bin/sh
# This should be run on the server
ROOT=server
TARGET=$ROOT/server

# rm -rf ${TARGET}
mkdir -p ${TARGET}

tar -xzf server.tar.gz -C ${TARGET}
echo "Extracted server into ${TARGET}"