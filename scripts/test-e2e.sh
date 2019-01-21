#!/usr/bin/env bash

rm -rf ../build/
npm run build
./node_modules/karma/bin/karma start karma.conf.js
