<template>
  <div class="flex flex-col">
    <q-dialog dark v-model="open">
      <q-card dark flat>
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
        <join-pool v-if="open && add" :pool="props.pool" :balances="balances" />
        <!-- <q-card-section v-if="open && add">
          <div class="q-pa-md">
            <q-input
              v-for="token in tokens"
              key="id"
              dark
              outlined
              type="number"
              bottom-slots
              v-model="token.amount"
              input-class="focus:ring-0 focus:ring-offset-0"
            >

              <template v-slot:before>
                <div class="bg-black h-full q-pa-sm">
                  {{ token.symbol }}
                </div>
              </template>

              <template v-slot:append>
                <div class="text-sm">${{ token.amount * token.priceRate }}</div>
              </template>


              <template v-slot:after>
                <q-btn color="deep-orange" outline>
                  <div class="row items-center no-wrap">
                    <q-icon left name="wallet" />
                    <div class="text-center">
                      {{
                        formatBalance(
                          balances[`${token.contract}${token.tokenId}`]
                        )
                      }}
                      {{ token.symbol }}
                    </div>
                  </div>
                </q-btn>
              </template>
            </q-input>
            <q-btn
              color="black"
              text-color="white"
              label="Add Liquidity"
              @click="addLiquidity"
            />
          </div>
        </q-card-section> -->
      </q-card>
    </q-dialog>
  </div>
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

const balances = ref(
  pool.value
    ? await useRepo(PoolRepository).updateUserBalances(pool.value, userAddress)
    : null
);
</script>
