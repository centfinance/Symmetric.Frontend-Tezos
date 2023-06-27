<template>
  <div>
    Swap Page

    <TokenSelect label="Token In" default="CTez" />
    <TokenSelect label="Token Out" default="SYMM" />
  </div>
</template>

<script lang="ts" setup>
const tokenIn = ref<any>(null);
const tokenOut = ref<any>(null);
</script>
