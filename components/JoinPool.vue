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
          v-model="token.amount"
          input-class="focus:ring-0 focus:ring-offset-0"
        >
          <!-- <template v-slot:before>
              <div class="bg-black">{{ token.symbol }}</div>
            </template> -->

          <template v-slot:before>
            <div class="bg-black h-full q-pa-sm">
              {{ token.symbol }}
            </div>
          </template>

          <template v-slot:append>
            <div class="text-sm">${{ token.amount * token.priceRate }}</div>
          </template>

          <!-- <template v-slot:hint
              >${{ token.amount * token.priceRate }}</template
            > -->
          <template v-slot:after>
            <q-btn color="orange" outline>
              <div class="row items-center no-wrap">
                <q-icon left name="wallet" />
                <div class="text-center">
                  {{
                    formatBalance(
                      props.balances[`${token.contract}${token.tokenId}`]
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
    </q-card-section>
  </div>
</template>

<script lang="ts" setup>
import { OpKind, WalletParamsWithKind } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";

import { Pool } from "~/store/models/Pool";

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

let tokens = computed(() =>
  pool.value?.pool_tokens.map((t) => {
    return {
      id: t.id,
      symbol: t.symbol,
      decimal: t.decimals,
      index: t.index,
      priceRate: 1,
      amount: 0,
      contract: t.address,
      tokenId: t.pool_token_id,
    };
  })
);

const formatBalance = (b: BigNumber | undefined) => {
  if (b) {
    return b.dividedBy(BigNumber(10).modulo(10, 18)).toFormat(3).toString();
  }
  return "0";
};

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
