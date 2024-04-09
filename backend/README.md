# Prebuilt solution for Whitelist NFT Claim via Apillon API

This repository contains source code for Whitelist NFT Claim API.

## Getting Started

This repository is configured to run with `npm`.

### Prerequisites

- Node.js v18.16.0 or higher
- npm v8.4.0 or higher
- Mysql database
- Deployed ApillonNftWhitelistClaim smart contract
- Private key for signing (address of which is set in the contract above)

### Run locally

First setup environment variables as described below then run:

```sh
npm install
npm run dev
```

### Endpoints

| Route                   | Description                              | Authentication required |
| ----------------------- | ---------------------------------------- | ----------------------- |
| GET `/`                 | Return API status                        | false                   |
| POST `/login`           | Admin wallet login                       | false                   |
| POST `/users`           | Admin add whitelisted wallets            | true                    |
| POST `/users/claim`     | Endpoint for getting the claim signature | true                    |
| GET `/users`            | Gets a list of all users                 | true                    |
| GET `/users/:id`        | Gets specifics for one user              | true                    |
| GET `/users/statistics` | Gets airdrop statistics                  | true                    |

## Environment variables

For local development and running app you will need to configure some environment variables. List of all supported vars can be found in [`src/config/env.ts`](/src/config/env.ts).

For local development you should create `.env` file. To run this app in Docker, you can create `.env.deploy` and `.env.sql.deploy` and use provided [`docker-compose.yml`](/docker-compose.yml)

### .env

For running locally, create new `.env` file in project root folder (`backend/`) and set at least all the variables (probably with different values) as in `.env.deploy` file described bellow.

### .env.deploy

For running a docker image with [`docker-compose.yml`](/docker-compose.yml) you should create `.env.deploy` file like this example:

```sh

MYSQL_HOST: mysql # DB host (container name or ip/url)
MYSQL_DB: whitelist-claim
MYSQL_USER: root
MYSQL_PASSWORD: Pa55worD?! # set your DB password (same as in .env.sql.deploy)

APP_URL: 'http://your-custom-url.com'  # set URL of your frontend application
ADMIN_WALLET: # your EVM wallet address

# Whitelist signature generation private key. Public key needs to be set on chain on the contract.
SIGNATURE_PRIVATE_KEY:
SIGNATURE_CONTRACT_ADDRESS:
# clam start time in Unix time from epoch format
CLAIM_START: 0

# Your email server configuration
SMTP_HOST:
SMTP_PORT: '465'
SMTP_USERNAME:
SMTP_PASSWORD:
SMTP_EMAIL_FROM:
SMTP_NAME_FROM: 'NFT Airdrop'

# API configuration (you can just live it as it is or appropriate fix dockerfile and compose)
API_HOST: 0.0.0.0
API_PORT: 3000
```

### .env.sql.deploy

For running a mysql docker image with [`docker-compose.yml`](/docker-compose.yml) you should create `.env.sql.deploy` file like this:

```sh
MYSQL_ROOT_PASSWORD: Pa55worD?! # set your DB password (same as in .env.deploy)
MYSQL_DATABASE: whitelist-claim

```

## Deploying with docker

Build docker image with script [`./build-image.sh`](/build-image.sh) script or by running docker build command, for example:

```sh
docker build -t ps-whitelist-claim .
docker tag ps-whitelist-claim ps-whitelist-claim:latest
```

If you correctly setup .env files, you can run app in docker by running

```sh
docker compose up -d
```

### Running API tests

```ssh
npm run test
```

To run single test

```ssh
npm run test -- <search pattern>
```

> note the blank space after `--`

Search pattern is used to find file with test. You may use filename or part of filename, for example `login.test`
