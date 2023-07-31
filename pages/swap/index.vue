<template>
  <div>
    <div class="w-max rounded-md mx-auto grid grid-cols-1 p-4 bg-black">
      <div class="pb-3 flex justify-end">
        <SetSlippage v-if="wallet" />
      </div>
      <div class="bg-grey-10 rounded p-4 flex justify-between">
        <div class="mr-4 w-52">
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
            default="CTez"
            :options="optionsInRef"
          />
          <div class="flex justify-end mt-1 pt-2 mr-2" v-if="wallet">
            Balance: {{ tokenIn?.balance }}
          </div>
        </div>
      </div>
      <div class="mx-auto">
        <q-btn dark round icon="arrow_downward" @click="switchTokens" />
      </div>
      <div class="flex-row bg-grey-10 rounded p-4 flex justify-between">
        <div class="mr-4 w-52">
          Amount Output
          <q-input
            dark
            :loading="loading"
            :model-value="amountOut?.amount"
            readonly
            borderless
            placeholder="0.00"
            input-class="focus:ring-0 focus:ring-offset-0 text-3xl"
          />
        </div>
        <div>
          <TokenSelect v-model="tokenOut" :options="optionsOutRef" />
          <div
            class="flex justify-end mt-1 pt-2 mr-2"
            v-if="tokenOut && wallet"
          >
            Balance: {{ tokenOut?.balance }}
          </div>
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
          :disable="!wallet"
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
import { Pool } from "~/store/models/Pool";
import { Wallet } from "~/store/models/Wallet";
import { Token } from "~/store/models/Token";
import { TokenRepository } from "~/store/repositories/TokenRepository";
import { calcSwapAmountOut, useSwap } from "~/composables/useSwap";
import { PoolRepository } from "~/store/repositories/PoolRepository";

useRepo(PoolRepository).fetchPoolData();

const tokenRepo = useRepo(TokenRepository);

await tokenRepo.fetch();

const tokens = computed(() =>
  useRepo(Token)
    .where("token_id", (id: any) => {
      return !isNaN(Number(id));
    })
    .where("total_balance_notional", (b: number) => {
      return b >= 100;
    })
    .get()
);

const client = await dappClient().getDAppClient();
const account = await client.getActiveAccount();
if (account) {
  useRepo(Wallet).save({
    id: account!.address,
    walletKey: account!.walletKey,
    lastConnected: account!.connectedAt,
    slippage: "0.5",
  });
}

const wallet = computed(() => useRepo(Wallet).all()[0]);

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
const tokenOut = ref<any>(options.value[1]);

const optionsInRef = ref(options);
const optionsOutRef = computed(() =>
  options.value.filter((o) => {
    return o.value !== tokenIn.value.value;
  })
);

const amountIn = ref(null);

const pool = computed(() => {
  return useRepo(Pool).with("pool_tokens").find(amountOut.value?.poolId);
});

const pools = computed(() => {
  if (tokenIn.value && tokenOut.value) {
    return useRepo(Pool)
      .with("pool_tokens")
      .where("tokens_list", (tokensString: string) => {
        const tokens = tokensString.split(",");
        return (
          tokens.includes(
            `${tokenIn.value.token.address}${tokenIn.value.token.id}`
          ) &&
          tokens.includes(
            `${tokenOut.value.token.address}${tokenOut.value.token.id}`
          )
        );
      })
      .get();
  }
  return null;
});

const loading = ref(false);

const amountOut = computed(() => {
  if (tokenIn.value && tokenOut.value && amountIn.value && pools.value) {
    const amounts = pools.value!.map((p) => {
      console.log(p);
      const token_in = p.pool_tokens.find(
        (t) =>
          t.address === tokenIn.value.token.address &&
          t.pool_token_id === tokenIn.value.token.id
      );
      const token_out = p.pool_tokens.find(
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
        p.swap_fee
      );

      return {
        poolId: p.id,
        amount,
      };
    });

    const max = amounts.reduce(function (prev, current) {
      return prev.amount > current.amount ? prev : current;
    });

    return max;
    // const token_in = pool.value?.pool_tokens.find(
    //   (t) =>
    //     t.address === tokenIn.value.token.address &&
    //     t.pool_token_id === tokenIn.value.token.id
    // );
    // const token_out = pool.value?.pool_tokens.find(
    //   (t) =>
    //     t.address === tokenOut.value.token.address &&
    //     t.pool_token_id === tokenOut.value.token.id
    // );
    // const amount = calcSwapAmountOut(
    //   amountIn.value!,
    //   token_in!.balance,
    //   token_out!.balance,
    //   { decimals: token_in!.decimals, weight: token_in!.weight },
    //   { decimals: token_out!.decimals, weight: token_out!.weight },
    //   pool.value!.swap_fee
    // );

    // return amount;
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
      const tx = await useSwap(
        pool.value!,
        tokenIn.value.token,
        tokenOut.value.token,
        amountIn.value!
      );
      const confirmation = await tx.confirmation();
      console.log(confirmation);
      confirmationRef.value = confirmation.block;
      amountIn.value = null;
      useRepo(PoolRepository).fetchPoolData();
    }
  } catch (e: any) {}
  loading.value = false;
};
</script>
