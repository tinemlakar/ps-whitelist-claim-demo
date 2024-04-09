# Apillon pre-built solution whitelist claim

[![Twitter Follow](https://img.shields.io/twitter/follow/Apillon?style=social)](https://twitter.com/intent/follow?screen_name=Apillon)

Allowing specific wallets to claim a NFT directly on chain can be tricky. This pre-build solution leverages off chain signatures and on chain verification method to give a very seamless experience for both the admin setting the whitelist addresses as well as the user claiming the NFT. You can update and change the addresses at any time.

**Access an admin panel to:** - Set wallets that can claim NFTs and see if they started the process.

**Before getting started, ensure you have:**

- Created NFT collection using [ApillonNftWhitelistClaim contract](https://github.com/Apillon/apillon-evm-contracts).
- A specialized Ethereum wallet for admin panel access.

**Options for deployment:**

- Run the front-end locally or host it on any website provider.
- Utilize Apillon's hosting service, with GitHub actions setup available.
- Run the back-end locally or via Docker, configuring files with collectible and email server details.

## Getting started

Solution consists of 2 main parts, Node.js backend APIs and Vue 3 frontend.

### Basic

If you have no experience with git and would still like to use our prebuilt solution, feel free to click the green button "Code" on the upper right corner of this repository and then selecting "Download ZIP".
Once downloaded, the zip file includes all files you need to run the application. Before that happens you need to set up configuration as described in documentation.

### Advanced

1. Fork the repo
2. Configure and modify APIs and website
3. Deploy API to docker or any other server that can run node.js applications
4. Deploy website to Apillon hosting

## Documentation

| Resource                       | Description              |
| ------------------------------ | ------------------------ |
| [Backend](backend/README.md)   | Docs for node.js backend |
| [Frontend](frontend/README.md) | Docs from Vue 3 frontend |

## License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.
