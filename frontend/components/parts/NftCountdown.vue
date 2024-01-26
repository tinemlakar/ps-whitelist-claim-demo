<script lang="ts" setup>
import colors from '~~/tailwind.colors';
import SuccessSVG from '~/assets/images/success.svg';
import { Countdown } from 'vue3-flip-countdown';

defineProps({
  timestamp: { type: Number, default: 0 },
});
</script>

<template>
  <div class="max-w-md w-full md:px-6 my-12 mx-auto">
    <img :src="SuccessSVG" class="mx-auto" width="165" height="169" alt="airdrop" />

    <div class="mt-8">
      <div class="text-center mb-4">
        <h3 class="mb-6">You are eligible to claim</h3>
        <strong>You can claim after</strong>
      </div>
      <Countdown
        :deadlineISO="new Date(timestamp).toISOString()"
        :flip-animation="false"
        :label-color="colors.bodyDark"
        :main-color="colors.white"
      />
    </div>
  </div>
</template>
