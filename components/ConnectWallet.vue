<template>
  <div v-if="connected">
    <q-btn-dropdown
      outline
      no-caps
      color="orange"
      :label="address"
      dropdown-icon="settings"
    >
      <q-list dark class="bg-black">
        <q-item dark dense clickable v-close-popup @click="">
          <q-item-section>
            <q-item-label>Copy Address</q-item-label>
          </q-item-section>
        </q-item>

        <q-item dark dense clickable v-close-popup @click="switchAccount">
          <q-item-section>
            <q-item-label>Switch Account</q-item-label>
          </q-item-section>
        </q-item>

        <q-item dark dense clickable v-close-popup @click="disconnect">
          <q-item-section>
            <q-item-label>Disconnect Wallet</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
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
const active = ref(await client.getActiveAccount());
const address = computed(
  () =>
    `${active.value?.address.substring(0, 7)}...${active.value?.address.slice(
      32
    )}`
);

const connected = computed(() => (active.value ? true : false));

const connect = async () => {
  await dappClient().connectAccount();
  active.value = await (await dappClient().getDAppClient()).getActiveAccount();
};

const switchAccount = async () => {
  await dappClient().swapAccount();
};

const disconnect = async () => {
  await dappClient().disconnectWallet();
  active.value = undefined;
};
</script>
