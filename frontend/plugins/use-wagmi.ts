import { UseWagmiPlugin, createConfig } from 'use-wagmi';
import { MetaMaskConnector } from 'use-wagmi/connectors/metaMask';
import { CoinbaseWalletConnector } from 'use-wagmi/connectors/coinbaseWallet';
import { WalletConnectConnector } from 'use-wagmi/connectors/walletConnect';
import { createPublicClient, http } from 'viem';
import { moonbeam, moonbaseAlpha } from 'use-wagmi/chains';

export default defineNuxtPlugin(nuxtApp => {
  const nuxtConfig = useRuntimeConfig();
  const chain = nuxtConfig.public.env === 'prod' ? moonbeam : moonbaseAlpha;
  const chains = [chain];

  const config = createConfig({
    autoConnect: true,
    connectors: [
      new MetaMaskConnector({
        chains,
        options: {
          UNSTABLE_shimOnConnectSelectAccount: true,
        },
      }),
      markRaw(
        new CoinbaseWalletConnector({
          chains,
          options: {
            appName: 'Whitelist claim',
          },
        })
      ),
      new WalletConnectConnector({
        chains,
        options: {
          projectId: 'fefd3005e5f3b8fd2e73de5333eeccf9',
          qrcode: true,
        },
      }),
    ],
    publicClient: createPublicClient({
      chain: chain,
      transport: http(),
    }),
  });

  nuxtApp.vueApp.use(UseWagmiPlugin, config);
});
