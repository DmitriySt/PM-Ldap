#!/bin/sh
cd ./frontend
rm ./buld
yarn build
rm -R ../backend/static
mkdir ../backend/static
cp -R ./build/* ../backend/static/
cd ../backend
yarn build
cp ./package.json ./dist/
cp ./Dockerfile ./dist/
cp ./.dockerignore ./dist/
cp ./.env ./dist/