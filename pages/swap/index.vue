<template>
  <div>
    <div class="container rounded-md mx-auto grid grid-cols-1 p-4 bg-black">
      <div class="pb-3 flex justify-end">
        <SetSlippage />
      </div>
      <div class="bg-grey-10 rounded p-4 flex justify-between">
        <div>
          Amount Input
          <q-input
            dark
            v-model="amountIn"
            debounce="500"
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
          Balance :
        </div>
      </div>
      <div class="mx-auto">
        <q-btn dark round icon="arrow_downward" />
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
        </div>
      </div>
      <div>
        <q-btn
          :loading="loading"
          color="black"
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

const options = [
  {
    label: "CTez",
    value: "CTez",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc30",
    icon: "https://thumbs.dipdup.net/Qme4ybadbY4H84h5WLPjdo47YQUxxVoJHWZrwYq2JZriM4",
    token: {
      address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
      id: 0,
    },
  },
  {
    label: "Symmetric",
    value: "SYMM",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc31",
    icon: "https://assets.coingecko.com/coins/images/18525/small/SYMM-Coin-2.png?1632276841",
    token: {
      address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
      id: 1,
    },
  },
  {
    label: "SIRS",
    value: "SIRS",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc32",
    icon: "https://services.tzkt.io/v1/avatars/KT1AafHA1C1vk959wvHWBispY9Y2f3fxBUUo",
    token: {
      address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
      id: 2,
    },
  },
  {
    label: "tzBTC",
    value: "tzBTC",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc33",
    icon: "https://services.tzkt.io/v1/avatars/KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn",
    token: {
      address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
      id: 3,
    },
  },
  {
    label: "EURL",
    value: "EURL",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc34",
    icon: "https://services.tzkt.io/v1/avatars/KT1JBNFcB5tiycHNdYGYCtR3kk6JaJysUCi8",
    token: {
      address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
      id: 4,
    },
  },
  {
    label: "KUSD",
    value: "KUSD",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc35",
    icon: "https://services.tzkt.io/v1/avatars/KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV",
    token: {
      address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
      id: 5,
    },
  },
  {
    label: "WTZ",
    value: "WTZ",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc36",
    icon: "https://services.tzkt.io/v1/avatars/KT1PnUZCp3u2KzWr93pn4DD7HAJnm3rWVrgn",
    token: {
      address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
      id: 6,
    },
  },
  {
    label: "wUSDC",
    value: "wUSDC",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc37",
    icon: "https://thumbs.dipdup.net/QmQfHU9mYLRDU4yh2ihm3zrvVFxDrLPiXNYtMovUQE2S2t",
    token: {
      address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
      id: 7,
    },
  },
];

const optionsInRef = ref(options);
const optionsOutRef = ref(
  options.filter((o) => {
    return o.value !== "CTez";
  })
);

const tokenIn = ref<any>(options[0]);
const tokenOut = ref<any>(null);

const amountIn = ref(null);
const amountOut = ref(null);

const updateTokenIn = (val: any) => {
  optionsOutRef.value = options.filter((o) => {
    return o.value !== val.value;
  });

  tokenIn.value = val;
};

const pool = computed(() => {
  return useRepo(Pool)
    .with("pool_tokens")
    .find("KT1ADiYeVqgr4xmVpcBatTQG3eopRRNGZj8k");
});

const loading = ref(false);

const swap = async () => {
  loading.value = true;
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
      BigNumber(BigNumber(amountIn.value!).toFixed(18)).multipliedBy(10 ** 18),
      wallet!.id,
      wallet!.slippage
    );
    console.log(request);
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
  }
  loading.value = false;
};
</script>
