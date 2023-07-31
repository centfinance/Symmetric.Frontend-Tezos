<template>
  <div v-if="connected">
    <q-btn-dropdown
      dark
      unelevated
      no-caps
      color="grey-10"
      class="text-orange"
      :label="address"
      dropdown-icon="menu"
    >
      <q-list dark bordered separator class="bg-black">
        <q-item dark dense clickable v-close-popup @click="copyAddress">
          <q-item-section avatar>
            <q-icon name="content_copy" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Copy Address</q-item-label>
          </q-item-section>
        </q-item>

        <q-item dark dense clickable v-close-popup @click="switchAccount">
          <q-item-section avatar>
            <q-icon name="switch_account" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Switch Account</q-item-label>
          </q-item-section>
        </q-item>

        <q-item dark dense clickable v-close-popup @click="disconnect">
          <q-item-section avatar>
            <q-icon name="logout" size="xs" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Disconnect Wallet</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <q-tooltip no-parent-event v-model="copied">Copied</q-tooltip>
  </div>
  <div v-else>
    <q-btn
      size="lg"
      color="orange"
      no-caps
      label="Connect Wallet"
      @click="connect"
    />
  </div>
</template>

<script lang="ts" setup>
import { Wallet } from "~/store/models/Wallet";
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
const wallet = computed(() => useRepo(Wallet).all()[0]);

const copied = ref(false);
const connect = async () => {
  const resp = await dappClient().connectAccount();
  useRepo(Wallet).save({
    id: resp.address,
    walletKey: resp.walletKey,
    lastConnected: resp.accountInfo.connectedAt,
    slippage: "0.5",
  });
  active.value = await (await dappClient().getDAppClient()).getActiveAccount();
};

const copyAddress = async () => {
  try {
    await navigator.clipboard.writeText(wallet.value.id);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch ($e) {
    alert("Cannot copy");
  }
};

const switchAccount = async () => {
  await dappClient().swapAccount();
};

const disconnect = async () => {
  await dappClient().disconnectWallet();
  useRepo(Wallet).flush();
  active.value = undefined;
};
</script>
<style scoped>
.q-btn {
  font-size: 1rem !important;
}
</style>
