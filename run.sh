#!/bin/bash
NAME='nawriter_service_fe'
yarn
yarn build
pm2 del $NAME
pm2 start --name $NAME 'yarn start'
pm2 save -f
