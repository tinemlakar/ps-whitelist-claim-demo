<script lang="ts" setup>
import { useAccount } from 'use-wagmi';
import SuccessSVG from '~/assets/images/success.svg';

const props = defineProps({
  signature: { type: String, required: true },
});
const emits = defineEmits(['claim']);

const message = useMessage();
const { address } = useAccount();
const { contract, provider, initContract, contractError } = useContract();

const loading = ref<boolean>(false);
const walletUsed = ref<boolean>(false);

onMounted(() => {
  initContract();
});

async function claim() {
  if (!contract.value || !provider.value) {
    console.warn('Please check CONTRACT_ADDRESS config!');
    message.warning('Failed to establish connection to contract.');
    return;
  }
  loading.value = true;

  try {
    walletUsed.value = await contract.value
      .connect(provider.value.getSigner())
      .walletUsed(address.value);

    if (walletUsed.value) {
      message.success('You already claimed NFT');
      await getMyNFT();
      return;
    }

    const tx = await contract.value.connect(provider.value.getSigner()).mint(1, props.signature);
    if (tx) {
      console.debug('Transaction', tx);
      message.success('You successfully claimed NFT');
    }

    tx.wait().then(async (receipt: any) => {
      console.debug('Transaction receipt', receipt);

      // get metadata
      await getMyNFT(receipt.transactionHash);
    });
  } catch (e) {
    contractError(e);
  }
  loading.value = false;
}

async function getMyNFT(txHash?: string) {
  const balance = contract.value ? await contract.value.balanceOf(address.value) : null;

  if (!contract.value || !balance || balance.toNumber() === 0) {
    loading.value = false;
    return;
  }

  try {
    const id = await contract.value.tokenOfOwnerByIndex(address.value, 0);
    const url = await contract.value.tokenURI(id);

    // TODO: change URL
    const metadata = await fetch(
      'https://bafybeidrw3rbuicnyra4rterlp3bh64qexkox33zvezhtnhglolejp5moa.ipfs.nectarnode.io/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjaWQiOiJiYWZ5YmVpZHJ3M3JidWljbnlyYTRydGVybHAzYmg2NHFleGtveDMzenZlemh0bmhnbG9sZWpwNW1vYSIsInByb2plY3RfdXVpZCI6ImFhZDliNmMxLTNiYzgtNDQ0YS1hZjQxLTM2ZTVlYjMwMDBmNyIsImlhdCI6MTcwNjE2ODg0Miwic3ViIjoiSVBGUy10b2tlbiJ9.LFOWeqKKas_5rcgklN-rXC2zUDP9SQhDeTQYNgI1818'
    ).then(response => {
      return response.json();
    });

    if (metadata) {
      emits('claim', metadata, txHash);
    } else {
      message.error('Missing metadata');
    }
  } catch (e) {
    console.error(e);
    message.error('Apologies, we were unable to load NFTs metadata.');
  }
  loading.value = false;
}
</script>

<template>
  <div class="max-w-md w-full md:px-6 my-12 mx-auto">
    <img :src="SuccessSVG" class="mx-auto" width="165" height="169" alt="airdrop" />

    <div class="my-8 text-center">
      <h3 class="mb-6">Great Success!</h3>
      <p>
        To join this NFT airdrop, you need to connect your EVM compatible wallet. This step is
        crucial for securely receiving and managing the airdropped NFTs.
      </p>
    </div>
    <Btn size="large" :loading="loading" :disabled="walletUsed" @click="claim()">Claim NFT</Btn>
  </div>
</template>
