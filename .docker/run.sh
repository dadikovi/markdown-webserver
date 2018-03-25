#!/bin/sh
git clone ${GIT_CLONE_URL} ../${APP_NAME}
node index.js -p ../${APP_NAME}