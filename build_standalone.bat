cd ./frontend
rmdir "./build" /S /Q
call yarn build
rmdir "../backend/static" /S /Q
mkdir "../backend/static"
xcopy "./build" "../backend/static" /e  /y
cd ../backend
call yarn build
copy "./package.json" "./dist/package.json"
copy "./Dockerfile" "./dist/Dockerfile"
copy "./.dockerignore" "./dist/.dockerignore"
copy "./.env" "./dist/.env"
