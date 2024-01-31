<script lang="ts" setup>
import { useAccount, useConnect, useWalletClient } from 'use-wagmi';

definePageMeta({
  layout: 'claim',
});
useHead({
  title: 'Apillon whitelist claim prebuilt solution',
});

const message = useMessage();
const config = useRuntimeConfig();
const { handleError } = useErrors();

const timestamp = useTimestamp();
const { address, isConnected } = useAccount();
const { data: walletClient, refetch } = useWalletClient();
const { connect, connectors } = useConnect();

const loading = ref<boolean>(false);
const metadata = ref<Metadata | null>(null);
const txHash = ref<string | undefined>();
const amount = ref<number>(1);
const walletSignature = ref<string | null>(null);

const timeToStart = computed(() => config.public.CLAIM_START - timestamp.value);

watch(
  () => address.value,
  walletAddress => {
    if (!walletAddress) {
      metadata.value = null;
      walletSignature.value = null;
    }
  }
);

async function validateWallet() {
  loading.value = true;
  try {
    await refetch();
    const timestamp = new Date().getTime();

    if (!walletClient.value) {
      await connect({ connector: connectors.value[0] });

      if (!walletClient.value) {
        message.error('Could not connect with wallet');
        loading.value = false;
        return;
      }
    }

    const signature = await walletClient.value.signMessage({ message: `test\n${timestamp}` });
    const res = await $api.post<ClaimResponse>('/users/claim', {
      signature,
      address: address.value,
      timestamp,
    });
    if (res.data && res.data.signature) {
      message.success('You have successfully validated your wallet and can now claim your NFT.');
      amount.value = res.data.amount;
      walletSignature.value = res.data.signature;
    }
  } catch (e) {
    handleError(e);
  }
  loading.value = false;
}

function onClaim(m: Metadata, hash?: string) {
  metadata.value = m;
  txHash.value = hash;
}
</script>

<template>
  <FormShare v-if="metadata" :metadata="metadata" :tx-hash="txHash" />
  <NftCountdown
    v-else-if="walletSignature && timeToStart > 0"
    :timestamp="$config.public.CLAIM_START"
  />
  <FormClaim
    v-else-if="walletSignature"
    :amount="amount"
    :signature="walletSignature"
    @claim="onClaim"
  />
  <div v-else class="max-w-md w-full md:px-6 my-12 mx-auto">
    <ConnectWallet v-if="!isConnected" size="large" />
    <Btn v-else size="large" :loading="loading" @click="validateWallet()">
      Wallet eligibility check
    </Btn>
  </div>
</template>
