import type { ConfigInterface } from '~/lib/types/general.types';

const config: ConfigInterface = {
  API_BASE: 'https://whitelist-claim-api.demo.apillon.io',
  CHAIN_ID: '1287', // moonbase (moonbeam testnet)
  CONTRACT_ADDRESS: '0x5c33dC6C23586A0c1Ca3eE7B20158454766Af0ce', // Contract address
  CLAIM_START: 0,
};

export default config;
