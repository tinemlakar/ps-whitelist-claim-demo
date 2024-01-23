<template>
  <div v-if="statistics" class="flex gap-8 mb-8">
    <div class="px-4 py-3 bg-bg-light rounded-lg min-w-[13em]">
      <h2 class="inline-block">{{ statistics.generatedSignature }}</h2>
      <span class="text-body ml-1">/{{ statistics.total || '?' }}</span>
      <p class="text-white">claimed/available NFTs</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

defineProps({
  statistics: { type: Object as PropType<StatisticsInterface>, default: null },
});
</script>
