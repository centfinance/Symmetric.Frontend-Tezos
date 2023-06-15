<template>
  <q-dialog dark v-model="open">
    <q-card dark flat style="min-width: 400px; max-width: 80vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Manage Pool</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          @click="$emit('PoolDialogClose')"
        />
      </q-card-section>
      <q-card-section>
        <q-btn-toggle
          v-model="add"
          spread
          no-caps
          toggle-color="orange"
          color="white"
          text-color="black"
          :options="[
            { label: 'Add Liquidity', value: true },
            { label: 'Remove Liquidity', value: false },
          ]"
        />
      </q-card-section>
      <join-pool v-if="open && add" :pool="props.pool" />
      <exit-pool v-if="open && !add" :pool="props.pool" />
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { Pool } from "~/store/models/Pool";
import { PoolRepository } from "~/store/repositories/PoolRepository";

const props = defineProps<{
  pool?: string | null;
}>();

const add = ref(true);

const open = computed(() => {
  return props.pool ? true : false;
});

const pool = computed(() => {
  if (props.pool) {
    return useRepo(Pool).with("pool_tokens").find(props.pool);
  }
  return null;
});

const tezos = await dappClient().tezos();
const userAddress = await tezos.wallet.pkh();

pool.value
  ? await useRepo(PoolRepository).updateUserBalances(pool.value, userAddress)
  : null;

pool.value
  ? await useRepo(PoolRepository).updateUserLPBalance(pool.value, userAddress)
  : null;
</script>
