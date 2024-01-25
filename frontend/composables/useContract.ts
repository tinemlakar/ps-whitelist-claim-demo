import { Contract, ethers, providers } from 'ethers';
import { useAccount, useNetwork, useSwitchNetwork } from 'use-wagmi';
import { mainnet, sepolia } from 'use-wagmi/chains';
import { abi } from '~/lib/config/abi';

export default function useContract() {
  const message = useMessage();
  const config = useRuntimeConfig();
  const { connector } = useAccount();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const contractAddress = config.public.CONTRACT_ADDRESS;
  const usedChain = config.public.env === 'prod' ? mainnet : sepolia;

  const contract = ref<Contract | null>(null);
  const provider = ref<providers.Web3Provider | null>(null);

  async function initProvider() {
    if (connector && connector.value) {
      if (!chain || !chain.value || chain?.value.id !== usedChain.id) {
        switchNetwork(usedChain.id);
      }
      const p = connector.value?.options?.getProvider
        ? connector.value.options.getProvider()
        : connector.value?.getProvider
        ? await connector.value.getProvider()
        : null;
      if (p) {
        provider.value = markRaw(new ethers.providers.Web3Provider(p));
      }
    }
  }

  /**
   * Helper for initializing specific contract
   */
  async function initContract() {
    await initProvider();

    if (!contractAddress) {
      message.warning('Please provide contract address in config!');
    } else if (!provider.value) {
      message.warning('Failed to establish contract connection');
    } else {
      contract.value = markRaw(new ethers.Contract(contractAddress, abi, provider.value));
    }
  }

  function contractError(e: any) {
    console.error('Use contracts error', e.code, e);

    // ignore user declined
    if (e?.code !== 4001) {
      const errorData =
        e?.reason ||
        e?.data?.message ||
        e?.error?.data?.message ||
        e?.error?.message ||
        e?.message ||
        '';
      let msg = '';

      if (errorData.includes('insufficient funds')) {
        // Insufficient funds
        msg = 'Wallet account does not have enough funds.';
      } else if (errorData.includes('Purchase would exceed max supply')) {
        // Max supply exceeded
        msg = 'Tokens depleted. You have requested too many or there is no more supply.';
      } else if (errorData.includes('Wallet already used')) {
        // Wallet already used
        msg = 'Wallet already used. This token has a limit of mints per wallet.';
      } else if (errorData.includes('Only WL addresses allowed.')) {
        // Wallet not whitelisted
        msg = 'Wallet not on whitelist. Only whitelisted wallet addresses are currently permitted.';
      } else if (errorData.includes('transfer caller is not owner nor approved')) {
        // Wallet not approved to use functionality
        msg = 'Wallet has not been approved to use this functionality.';
      } else if (errorData.includes('Character with these traits already minted')) {
        // Character already minted
        msg = 'A character with selected traits has already been minted.';
      } else if (errorData.includes('valid recovery code')) {
        // Problem with embedded signature
        msg = 'Problem with embedded wallet';
      } else if (errorData.includes('user rejected transaction')) {
        // User rejected the transaction
        msg = 'Transaction was rejected.';
      } else {
        // Blockchain communication error
        msg = 'Blockchain error. Please retry or contact support if the issue persists.';
      }

      message.error(msg);
    }
  }

  return {
    contract: computed(() => contract.value),
    provider,

    contractError,
    initContract,
  };
}
