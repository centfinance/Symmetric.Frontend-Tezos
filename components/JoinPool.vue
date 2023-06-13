<template>
  <div class="flex flex-col">
    <q-card-section>
      <div class="q-pa-md">
        <q-input
          v-for="token in tokens"
          key="id"
          dark
          outlined
          type="number"
          bottom-slots
          v-model="amount"
          input-class="focus:ring-0 focus:ring-offset-0"
        >
          <!-- <template v-slot:before>
              <div class="bg-black">{{ token.symbol }}</div>
            </template> -->

          <template v-slot:before>
            <!-- <div class="bg-black h-full q-pa-sm"> -->
            <q-avatar size="60px">
              <q-img
                :src="poolTokens[token.index].icon"
                spinner-color="white"
              />
            </q-avatar>
            <!-- </div> -->
          </template>

          <template v-slot:append>
            <div class="text-sm">
              {{ token.symbol }}
            </div>
            <div class="text-sm">
              ${{ Number(token.amount) * token.priceRate }}
            </div>
          </template>

          <!-- <template v-slot:hint
              >${{ token.amount * token.priceRate }}</template
            > -->
          <template v-slot:after>
            <q-btn
              color="orange"
              outline
              @click="
                () => (amount = poolTokens[token.index].normalizedBalance())
              "
            >
              <div class="row items-center no-wrap">
                <q-icon left name="wallet" />
                <div class="text-center">
                  {{ poolTokens[token.index].formatBalance() }}
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
    </q-card-section>
  </div>
</template>

<script lang="ts" setup>
import { OpKind, WalletParamsWithKind } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";

import { Pool } from "~/store/models/Pool";
import { PoolToken } from "~/store/models/PoolToken";

const props = defineProps<{
  pool?: string | null;
  balances: any;
}>();

const pool = computed(() => {
  if (props.pool) {
    return useRepo(Pool).with("pool_tokens").find(props.pool);
  }
  return null;
});
const poolTokens = computed(() => {
  return useRepo(PoolToken)
    .where("pool_id", pool.value?.id)
    .orderBy("index")
    .get();
});

let tokens = computed(() =>
  poolTokens.value?.map((t) => {
    return {
      id: t.id,
      symbol: t.symbol,
      decimal: t.decimals,
      index: t.index,
      priceRate: 1,
      amount: "0",
    };
  })
);

const amount = ref("0");

const addLiquidity = async () => {
  const tezos = await dappClient().tezos();
  const request = await createJoinRequest(
    tezos,
    pool.value!.address,
    tokens.value!.map((t) => [t.index, BigInt(t.amount)])
  );
  const params = request?.toTransferParams();

  const contractCall: WalletParamsWithKind = {
    kind: OpKind.TRANSACTION,
    ...params!,
  };

  const batch = tezos.wallet.batch([contractCall]);

  console.log(batch);
};

console.log(tokens);
</script>
