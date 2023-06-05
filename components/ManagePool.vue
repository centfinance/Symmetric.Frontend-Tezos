<template>
  <div class="flex flex-col">
    <q-dialog dark v-model="open">
      <q-card dark flat>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Close icon</div>
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
              label="Add Liquidity"
              @click="addLiquidity"
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts" setup>
import { TezosOperationType } from "@airgap/beacon-sdk";
import {
  OpKind,
  WalletParamsWithKind,
  WalletTransferParams,
} from "@taquito/taquito";
import { Pool } from "~/store/models/Pool";

const props = defineProps<{
  pool?: string | null;
}>();

const open = computed(() => {
  console.log(props.pool);
  return props.pool ? true : false;
});

const pool = computed(() => {
  console.log(props.pool);
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
    };
  })
);

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
