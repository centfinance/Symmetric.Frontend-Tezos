<template>
  <div class="flex flex-col">
    <q-dialog dark v-model="medium">
      <q-card dark flat>
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
            <!-- 
        <template v-slot:after>
          <q-btn round dense flat icon="send" />
        </template> -->
          </q-input>
          <q-btn
            color="black"
            text-color="white"
            label="Add Liqudity"
            @click="addLiquidity"
          />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Pool } from "~/store/models/Pool";
const medium = true;
const route = useRoute();
const pool = useRepo(Pool)
  .with("pool_tokens")
  .find(route.params.address as string);

let tokens = pool?.pool_tokens.map((t) => {
  return {
    id: t.id,
    symbol: t.symbol,
    decimal: t.decimals,
    index: t.index,
    priceRate: 1,
    amount: 0,
  };
});

const addLiquidity = async () => {
  const tezos = await dappClient().tezos();
  const request = await createJoinRequest(
    tezos,
    pool!.address,
    tokens!.map((t) => [t.index, BigInt(t.amount)])
  );
  console.log(request);
};
console.log(tokens);
</script>
