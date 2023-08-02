<template>
  <nav class="grid grid-cols-3 justify-between items-center p-6">
    <!-- Left side -->
    <div class="flex space-x-8">
      <NuxtLink to="/swap" class="text-white font-bold text-xl">Swap</NuxtLink>
      <NuxtLink to="/pools" class="text-white font-bold text-xl"
        >Pools</NuxtLink
      >
    </div>

    <!-- Middle -->
    <div class="place-self-center">
      <img src="~/public/symm-logo.svg" alt="logo" class="h-16 w-auto" />
    </div>

    <!-- Right side -->
    <div class="flex flex-row place-content-end gap-4">
      <NuxtLink
        to="https://faucet-api.symmetric.workers.dev"
        class="text-white text-lg p-2"
        target="_blank"
        >Faucet</NuxtLink
      >
      <ConnectWallet />
    </div>
  </nav>
</template>

<script lang="ts" setup>
// Here you can add logic for the Connect Wallet button
</script>
