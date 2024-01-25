<script lang="ts" setup>
import { useAccount, useConnect, useWalletClient } from 'use-wagmi';

definePageMeta({
  layout: 'claim',
});
useHead({
  title: 'Apillon whitelist claim prebuilt solution',
});

const message = useMessage();
const { handleError } = useErrors();

const { address, isConnected } = useAccount();
const { data: walletClient, refetch } = useWalletClient();
const { connect, connectors, isLoading } = useConnect();

const loading = ref<boolean>(false);
const metadata = ref<Metadata | null>(null);
const walletSignature = ref<string | null>(null);

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
      walletSignature.value = res.data.signature;
    }
  } catch (e) {
    handleError(e);
  }
  loading.value = false;
}
</script>

<template>
  <FormShare v-if="metadata" :metadata="metadata" />
  <FormClaim
    v-else-if="walletSignature"
    :signature="walletSignature"
    @claim="m => (metadata = m)"
  />
  <div v-else class="max-w-md w-full md:px-6 my-12 mx-auto">
    <Btn
      v-if="!isConnected"
      size="large"
      :loading="isLoading"
      @click="connect({ connector: connectors[0] })"
    >
      Connect wallet
    </Btn>
    <Btn v-else size="large" :loading="loading" @click="validateWallet()">Validate wallet</Btn>
  </div>
</template>
