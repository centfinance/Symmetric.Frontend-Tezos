<template>
  <div v-if="connected">
    <UDropdown dark :items="items" :popper="{ placement: 'bottom-start' }">
      <UButton
        icon="i-heroicons-adjustments-vertical"
        size="xl"
        color="primary"
        variant="outline"
        :label="address"
        trailing
      />
    </UDropdown>
  </div>
  <div v-else>
    <UButton
      size="xl"
      color="primary"
      variant="solid"
      label="Connect Wallet"
      @click="connect"
    />
  </div>
</template>

<script lang="ts" setup>
import { dappClient } from "~/utils/walletconnect";

const client = await dappClient().getDAppClient();
const active = await client.getActiveAccount();
const address = `${active?.address.substring(0, 4)}...${active?.address.slice(
  32
)}`;
const connected = (await client.getActiveAccount()) ? true : false;

const connect = async () => {
  await dappClient().connectAccount();
};

const disconnect = async () => {
  await dappClient().disconnectWallet();
};

const items = [
  [
    {
      label: "Copy Address",
      icon: "i-heroicons-archive-box-20-solid",
    },
  ],
  [
    {
      label: "Switch Account",
      icon: "i-heroicons-archive-box-20-solid",
      click: connect,
    },
  ],
  [
    {
      label: "Disconnect",
      icon: "i-heroicons-archive-box-20-solid",
      click: disconnect,
    },
  ],
];
</script>
