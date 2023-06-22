<template>
  <div>
    <q-btn-dropdown
      dark
      outline
      dense
      fab-mini
      dropdown-icon="none"
      icon="tune"
      class="tx-settings"
      color="orange"
      :label="`${slippage}%`"
    >
      <div class="bg-black text-white no-wrap p-4">
        <div class="col">
          <div class="text-h7 font-bold q-mb-md">Slippage Tolerance</div>
          <q-input
            dark
            outlined
            autofocus
            :model-value="slippage"
            color="orange"
            suffix="%"
            mask="#.##"
            input-class="focus:ring-0 focus:ring-offset-0"
            @update:model-value="updateSlippage"
          />
        </div>
      </div>
    </q-btn-dropdown>
  </div>
</template>
<script lang="ts" setup>
import { Wallet } from "~/store/models/Wallet";

const client = await dappClient().getDAppClient();
const account = await client.getActiveAccount();
const wallet = useRepo(Wallet).find(account!.address);
console.log(account);
if (!wallet) {
  useRepo(Wallet).save({
    id: account!.address,
    walletKey: account!.walletKey,
    lastConnected: account!.connectedAt,
    slippage: "0.5",
  });
}
const slippage = computed(
  () => useRepo(Wallet).find(account!.address)!.slippage
);

const updateSlippage = (value: string | number | null) => {
  if (value) {
    useRepo(Wallet).save({
      id: account?.address,
      slippage: value,
    });
  }
};
</script>
<style>
.tx-settings .q-btn__content .q-btn-dropdown__arrow {
  display: none !important;
}
</style>
