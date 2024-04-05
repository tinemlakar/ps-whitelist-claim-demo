set -e

docker build -t ps-whitelist-claim .
docker tag ps-whitelist-claim ps-whitelist-claim:latest
# docker save -o ps-whitelist-claim.tar ps-whitelist-claim:latest