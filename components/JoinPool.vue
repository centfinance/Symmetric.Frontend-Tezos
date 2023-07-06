<template>
  <div class="flex flex-col">
    <div>
      <div class="q-pa-md">
        <q-input
          v-for="token in tokens"
          :ref="inputRefs[token.index]"
          key="id"
          dark
          outlined
          color="white"
          type="number"
          placeholder="0.00"
          bottom-slots
          v-model="amounts[token.index].value"
          input-class="focus:ring-0 focus:ring-offset-0"
          @update:model-value="calculateAmounts(token.index)"
          :rules="[
            (val) => val > 0 || 'No amount entered',
            (val) =>
              val <= poolTokens[token.index].normalizedBalance() ||
              'Not enough Balance',
          ]"
          lazy-rules="ondemand"
        >
          <!-- <template v-slot:before>
              <div class="bg-black">{{ token.symbol }}</div>
            </template> -->

          <template v-slot:before>
            <!-- <div class="bg-black h-full q-pa-sm"> -->
            <q-avatar size="40px">
              <q-img
                :src="poolTokens[token.index].icon"
                spinner-color="white"
              />
            </q-avatar>
            <!-- </div> -->
          </template>

          <template v-slot:append>
            <div class="text-sm">
              {{ price && pool?.total_liquidity > 0 ? price : "" }}
            </div>
          </template>

          <!-- <template v-slot:hint
              >${{ token.amount * token.priceRate }}</template
            > -->
          <template v-slot:after>
            <q-btn
              color="orange"
              outline
              dense
              @click="
                () => {
                  amounts[token.index].value =
                    poolTokens[token.index].normalizedBalance();
                  calculateAmounts(token.index);
                }
              "
            >
              <div class="row items-center no-wrap">
                <q-icon left name="wallet" />
                <div class="text-center leading-4">
                  {{ token.symbol }}
                  <br />
                  {{ poolTokens[token.index].formatBalance() }}
                </div>
              </div>
            </q-btn>
          </template>
        </q-input>
        <q-btn
          :loading="loading"
          color="black"
          spread
          no-caps
          text-color="white"
          label="Add Liquidity"
          class="full-width"
          @click="addLiquidity"
        >
          <template v-slot:loading>
            <q-spinner-hourglass class="on-left" />
            Sending...
          </template>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { OpKind, WalletParamsWithKind } from "@taquito/taquito";
import { localForger } from "@taquito/local-forging";
import { BigNumber } from "bignumber.js";
import { Pool } from "~/store/models/Pool";
import { PoolToken } from "~/store/models/PoolToken";
import { Wallet } from "~/store/models/Wallet";

const props = defineProps<{
  pool?: string | null;
  pricingAsset: PoolToken | null;
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

const balances = computed(() =>
  pool.value?.pool_tokens.map((t) => {
    return {
      balance: BigNumber(t.balance),
      index: t.index,
    };
  })
);

const inputRefs = ref(new Array(tokens.value.length).fill(ref(null)));

const amounts = tokens.value?.map((t) => ref<string | undefined>(undefined));

const calculateAmounts = (i: number) => {
  if (pool.value?.total_liquidity > 0) {
    if (amounts[i].value && !isNaN(parseInt(amounts[i].value!))) {
      const amountsOut = computeProportionalAmountsIn(
        BigNumber(amounts[i].value as string),
        i,
        balances.value!
      );

      amountsOut.forEach((a, index) => {
        if (index !== i) {
          amounts[index].value = a.amount.toFixed(18);
        }
      });
    }
  }
};

const price = computed(() => {
  if (props.pricingAsset) {
    const price = amounts[props.pricingAsset!.index!].value!;
    if (isNaN(parseInt(price))) {
      return PoolToken.formatPrice("0");
    }
    return PoolToken.formatPrice(price);
  }
  return null;
});

const loading = ref(false);

const addLiquidity = async () => {
  loading.value = true;
  inputRefs.value.forEach((input, i) => input.value[i].validate());
  const tezos = await dappClient().tezos();
  const client = await dappClient().getDAppClient();
  const account = await client.getActiveAccount();
  const wallet = useRepo(Wallet).find(account!.address);
  const request = await createJoinRequest(
    tezos,
    pool.value!.address,
    amounts.map((a, i) => [
      i,
      BigNumber(a.value!).multipliedBy(10 ** poolTokens.value[i].decimals),
    ]),
    parseInt(wallet?.slippage!)
  );
  const params = request?.toTransferParams();
  console.log(params);

  // const approvals = pool.value?.pool_tokens.map((t) => {
  //   return {
  //     type: t.FA2 ? 2 : 1,
  //     value: {
  //       tokenContract: t.address,
  //       tokenId: t.FA2 ? t.pool_token_id : undefined,
  //       allowance: t.FA2 ? undefined : t.amount,
  //       owner: wallet!.id,
  //     },
  //   };
  // }) as any[];

  const operatorCalls = await fa2UpdateOperators(
    tezos,
    wallet!.id,
    pool.value!.pool_tokens[0].address,
    pool.value!.pool_tokens.map((t) => t.pool_token_id),
    "KT1N5qYdthynXLfGbteRVHgKy4m6q2NGjt57"
  );

  // const approveCalls = approveData(
  //   approvals,
  //   "KT1N5qYdthynXLfGbteRVHgKy4m6q2NGjt57"
  // );

  const contractCall: WalletParamsWithKind = {
    kind: OpKind.TRANSACTION,
    ...params!,
  };
  const transactions = [];

  transactions.push(...operatorCalls.approveRequests);
  transactions.push(contractCall);
  transactions.push(...operatorCalls.revokeRequests);

  // transactions.push(...approveCalls.fa1.revokes);
  // transactions.push(...approveCalls.fa1.approves);
  // transactions.push(...approveCalls.fa2.approves);

  // transactions.push(...approveCalls.fa2.revokes);

  console.log(transactions);
  const batch = tezos.wallet.batch(transactions);
  const tx = await batch.send();
  const confirmation = await tx.confirmation();
  console.log(confirmation);
  // console.log(batch);
  // const preparedBatch = await tezos.prepare.batch(transactions);
  // // const forgeParams = await tezos.prepare.toForge(preparedBatch);

  // // const prepareParams = await tezos.prepare.toPreapply(preparedBatch);
  // // console.log(prepareParams);

  // const preApplyOps = await tezos.rpc.runOperation({
  //   operation: preparedBatch.opOb,
  //   chain_id: "NetXnHfVqm9iesp",
  // });
  // console.log(preApplyOps);
  loading.value = false;
};
</script>
