<script lang="ts" setup>
import SuccessSVG from '~/assets/images/success.svg';

const props = defineProps({
  signature: { type: String, required: true },
  amount: { type: Number, default: 1 },
});
const emits = defineEmits(['claim']);

const message = useMessage();
const txWait = useTxWait();
const {
  contract,
  initContract,
  contractError,
  getBalance,
  getTokenOfOwner,
  getTokenUri,
  isWalletUsed,
  mint,
} = useContract();

const loading = ref<boolean>(false);
const walletUsed = ref<boolean>(false);

onMounted(() => {
  initContract();
});

async function claim() {
  if (!contract.value) {
    console.warn('Please check CONTRACT_ADDRESS config!');
    message.warning('Failed to establish connection to contract.');
    return;
  }
  loading.value = true;

  try {
    walletUsed.value = await isWalletUsed();

    if (walletUsed.value) {
      message.success('You already claimed NFT');
      await getMyNFT();
      return;
    }

    txWait.hash.value = await mint(props.amount, props.signature);

    console.debug('Transaction', txWait.hash.value);
    message.info('Your NFT Mint has started');

    await txWait.wait();

    console.debug('Transaction receipt', txWait.hash.value);
    message.success('You successfully claimed NFT');

    // get metadata
    await getMyNFT(txWait.hash.value);
    loading.value = false;
  } catch (e) {
    contractError(e);
    loading.value = false;
  }
}

async function getMyNFT(txHash?: string) {
  const balance = contract.value ? await getBalance() : null;

  if (!contract.value || !balance || balance.toString() === '0') {
    loading.value = false;
    return;
  }

  try {
    const id = await getTokenOfOwner(0);
    const url = await getTokenUri(id);

    const metadata = await fetch(url).then(response => {
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
