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
import { OpKind, WalletParamsWithKind } from "@taquito/taquito";
import { BigNumber } from "bignumber.js";
import { Pool } from "~/store/models/Pool";

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

let tokens = computed(() =>
  pool.value?.pool_tokens.map((t) => {
    return {
      id: t.id,
      symbol: t.symbol,
      decimal: t.decimals,
      index: t.index,
      priceRate: 1,
      amount: 0,
      balance: "0",
      contract: t.address,
      tokenId: t.pool_token_id,
    };
  })
);
const tezos = await dappClient().tezos();
const userAddress = await tezos.wallet.pkh();

const balances = ref();

balances.value = (
  await getBalanceFromTzkt(
    tokens.value!.map((t) => t.contract),
    tokens.value!.map((t) => t.tokenId),
    userAddress
  )
).balances;

console.log(balances);

const addLiquidity = async () => {
  const request = await createJoinRequest(
    tezos,
    pool.value!.address,
    tokens.value!.map((t) => [t.index, BigInt(t.amount)])
  );
  const params = request?.toTransferParams();
  const approvals = pool.value?.pool_tokens.map((t) => {
    return {
      type: t.FA2 ? 2 : 1,
      value: {
        tokenContract: t.address,
        tokenId: t.FA2 ? t.pool_token_id : undefined,
        allowance: t.FA2 ? undefined : t.amount,
      },
    };
  }) as any[];

  const approveCalls = approveData(
    approvals,
    "KT1N5qYdthynXLfGbteRVHgKy4m6q2NGjt57"
  );

  const contractCall: WalletParamsWithKind = {
    kind: OpKind.TRANSACTION,
    ...params!,
  };
  const transactions = [];

  transactions.push(...approveCalls.fa1.revokes);
  transactions.push(...approveCalls.fa1.approves);
  transactions.push(...approveCalls.fa2.approves);
  transactions.push(contractCall);
  transactions.push(...approveCalls.fa2.revokes);

  const batch = tezos.wallet.batch(transactions);

  console.log(batch);
};

console.log(tokens);
</script>
