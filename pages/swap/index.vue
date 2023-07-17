<template>
  <div>
    <div class="w-2/3 rounded-md mx-auto grid grid-cols-1 p-4 bg-black">
      <div class="pb-3 flex justify-end">
        <SetSlippage />
      </div>
      <div class="bg-grey-10 rounded p-4 flex justify-between">
        <div>
          Amount Input
          <q-input
            dark
            v-model="amountIn"
            borderless
            placeholder="0.00"
            input-class="focus:ring-0 focus:ring-offset-0 text-3xl"
          />
        </div>
        <div>
          <TokenSelect
            v-model="tokenIn"
            label="Token In"
            default="CTez"
            :options="optionsInRef"
          />
          <div>Balance: {{ tokenIn?.balance }}</div>
        </div>
      </div>
      <div class="mx-auto">
        <q-btn dark round icon="arrow_downward" @click="switchTokens" />
      </div>
      <div class="bg-grey-10 rounded p-4 flex justify-between">
        <div>
          Amount Output
          <q-input
            dark
            :loading="loading"
            v-model="amountOut"
            readonly
            borderless
            placeholder="0.00"
            input-class="focus:ring-0 focus:ring-offset-0 text-3xl"
          />
        </div>
        <div>
          <TokenSelect
            v-model="tokenOut"
            label="Select Token"
            :options="optionsOutRef"
          />
          <div v-if="tokenOut">Balance: {{ tokenOut?.balance }}</div>
        </div>
      </div>
      <div v-if="loading || confirmationRef" class="p-4 mt-8 bg-gray-900">
        <div
          class="p-4 flex flex-col text-2xl items-center gap-2"
          v-if="confirmationRef"
        >
          <div>Swap Completed 🎉</div>
          <div class="text-sm text-blue-500">
            <a
              :href="`https://ghostnet.tzkt.io/${
                confirmationRef.operations.at(-1).at(-1).hash
              }`"
              target="_blank"
              >{{ confirmationRef.operations.at(-1).at(-1).hash }}</a
            >
          </div>
        </div>
        <q-skeleton v-if="loading" type="text"></q-skeleton>
      </div>
      <div class="mt-8">
        <q-btn
          :loading="loading"
          color="orange"
          spread
          no-caps
          text-color="white"
          label="Swap"
          class="full-width"
          @click="swap"
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
import { BigNumber } from "bignumber.js";
import { Pool } from "~/store/models/Pool";
import { Wallet } from "~/store/models/Wallet";
import { Token } from "~/store/models/Token";
import { TokenRepository } from "~/store/repositories/TokenRepository";
import { calcSwapAmountOut } from "~/composables/useSwap";

const tokenRepo = useRepo(TokenRepository);

await tokenRepo.fetch();

const tokens = computed(() =>
  useRepo(Token)
    .where("token_id", (id: any) => {
      return !isNaN(Number(id));
    })
    .get()
);

const client = await dappClient().getDAppClient();
const account = await client.getActiveAccount();
if (!account) {
}
const wallet = useRepo(Wallet).find(account!.address);
if (!wallet) {
  useRepo(Wallet).save({
    id: account!.address,
    walletKey: account!.walletKey,
    lastConnected: account!.connectedAt,
    slippage: "0.5",
  });
}
await tokenRepo.fetchUserBalances(useRepo(Wallet).find(account!.address)!.id);

const options = computed(() =>
  tokens.value.map((t) => {
    return {
      label: t.symbol,
      value: t.symbol,
      description: t.id,
      icon: t.icon,
      token: {
        address: t.address,
        id: t.token_id,
        decimals: t.decimals,
      },
      balance: t.formatBalance(),
    };
  })
);

const tokenIn = ref<any>(options.value[0]);
const tokenOut = ref<any>(null);

const optionsInRef = ref(options);
const optionsOutRef = computed(() =>
  options.value.filter((o) => {
    return o.value !== tokenIn.value.value;
  })
);

const amountIn = ref(null);

const estimate = ref<any>(null);

const pool = computed(() => {
  return useRepo(Pool)
    .with("pool_tokens")
    .find("KT1VHbP2ska1R5goBCER1W8n1CNDKRPXSpn1");
});

const loading = ref(false);

const amountOut = computed(() => {
  if (tokenIn.value && tokenOut.value && amountIn.value) {
    const token_in = pool.value?.pool_tokens.find(
      (t) =>
        t.address === tokenIn.value.token.address &&
        t.pool_token_id === tokenIn.value.token.id
    );
    const token_out = pool.value?.pool_tokens.find(
      (t) =>
        t.address === tokenOut.value.token.address &&
        t.pool_token_id === tokenOut.value.token.id
    );
    const amount = calcSwapAmountOut(
      amountIn.value!,
      token_in!.balance,
      token_out!.balance,
      { decimals: token_in!.decimals, weight: token_in!.weight },
      { decimals: token_out!.decimals, weight: token_out!.weight },
      pool.value!.swap_fee
    );

    return amount;
  }
  return null;
});

const switchTokens = () => {
  if (tokenIn.value && tokenOut.value) {
    const oldToken = tokenIn.value;
    tokenIn.value = tokenOut.value;
    tokenOut.value = oldToken;
  }
};

// watch(amountIn, async () => {
//   if (
//     tokenIn.value &&
//     tokenOut.value &&
//     tokenIn.value !== tokenOut.value &&
//     amountIn.value
//   ) {
//     const tezos = await dappClient().tezos();
//     const client = await dappClient().getDAppClient();
//     const account = await client.getActiveAccount();
//     const wallet = useRepo(Wallet).find(account!.address);
//     const request = await createSwapRequest(
//       tezos,
//       pool.value!,
//       tokenIn.value.token,
//       tokenOut.value.token,
//       BigNumber(BigNumber(amountIn.value!).toFixed(18)).multipliedBy(10 ** 18),
//       wallet!.id,
//       wallet!.slippage
//     );
//     const params = request.toTransferParams();

//     const operatorCalls = await fa2UpdateOperators(
//       tezos,
//       wallet!.id,
//       pool.value!.pool_tokens[0].address,
//       [tokenIn.value.token.id],
//       "KT1N5qYdthynXLfGbteRVHgKy4m6q2NGjt57"
//     );

//     const contractCall: ParamsWithKind = {
//       kind: OpKind.TRANSACTION,
//       ...params!,
//     };
//     const transactions = [];

//     transactions.push(...(operatorCalls.approveRequests as ParamsWithKind[]));
//     transactions.push(contractCall);
//     transactions.push(...(operatorCalls.revokeRequests as ParamsWithKind[]));
//     const estimates = await tezos.estimate.batch(transactions);
//     console.log(estimates);
//     estimate.value = estimates[1];
//     console.log(estimate.value);
//   }
//   estimate.value = null;
// });
const confirmationRef = ref<any>(null);
const swap = async () => {
  loading.value = true;
  try {
    if (tokenIn.value && tokenOut.value && tokenIn.value !== tokenOut.value) {
      const tezos = await dappClient().tezos();
      const client = await dappClient().getDAppClient();
      const account = await client.getActiveAccount();
      const wallet = useRepo(Wallet).find(account!.address);
      const request = await createSwapRequest(
        tezos,
        pool.value!,
        tokenIn.value.token,
        tokenOut.value.token,
        BigNumber(BigNumber(amountIn.value!).toFixed(18)).multipliedBy(
          10 ** 18
        ),
        wallet!.id,
        wallet!.slippage
      );
      const params = request.toTransferParams();

      const operatorCalls = await fa2UpdateOperators(
        tezos,
        wallet!.id,
        pool.value!.pool_tokens[0].address,
        [tokenIn.value.token.id],
        "KT1N5qYdthynXLfGbteRVHgKy4m6q2NGjt57"
      );

      const contractCall: WalletParamsWithKind = {
        kind: OpKind.TRANSACTION,
        ...params!,
      };
      const transactions = [];

      transactions.push(...operatorCalls.approveRequests);
      transactions.push(contractCall);
      transactions.push(...operatorCalls.revokeRequests);

      const batch = tezos.wallet.batch(transactions);
      const tx = await batch.send();
      const confirmation = await tx.confirmation();
      console.log(confirmation);
      confirmationRef.value = confirmation.block;
      amountIn.value = null;
    }
  } catch (e: any) {}
  loading.value = false;
};
</script>
