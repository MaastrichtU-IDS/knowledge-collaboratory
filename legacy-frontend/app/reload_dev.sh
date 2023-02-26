#!/bin/bash

export CURRENT_FOLDER=$(pwd)
cd /opt/react-taggy
yarn

cd $CURRENT_FOLDER
yarn add file:/opt/react-taggy
yarn dev
