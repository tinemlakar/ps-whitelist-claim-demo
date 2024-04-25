set -e

docker build -t ps-whitelist-claim-app .
docker tag ps-whitelist-claim-app ps-whitelist-claim-app:latest
docker save -o ps-whitelist-claim-app.tar ps-whitelist-claim-app:latest