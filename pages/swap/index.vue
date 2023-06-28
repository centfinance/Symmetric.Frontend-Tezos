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
    </div>
  </div>
</template>

<script lang="ts" setup>
const options = [
  {
    label: "CTez",
    value: "CTez",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc30",
    icon: "https://thumbs.dipdup.net/Qme4ybadbY4H84h5WLPjdo47YQUxxVoJHWZrwYq2JZriM4",
  },
  {
    label: "Symmetric",
    value: "SYMM",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc31",
    icon: "https://assets.coingecko.com/coins/images/18525/small/SYMM-Coin-2.png?1632276841",
  },
  {
    label: "SIRS",
    value: "SIRS",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc32",
    icon: "https://services.tzkt.io/v1/avatars/KT1AafHA1C1vk959wvHWBispY9Y2f3fxBUUo",
  },
  {
    label: "tzBTC",
    value: "tzBTC",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc33",
    icon: "https://services.tzkt.io/v1/avatars/KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn",
  },
  {
    label: "EURL",
    value: "EURL",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc34",
    icon: "https://services.tzkt.io/v1/avatars/KT1JBNFcB5tiycHNdYGYCtR3kk6JaJysUCi8",
  },
  {
    label: "KUSD",
    value: "KUSD",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc35",
    icon: "https://services.tzkt.io/v1/avatars/KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV",
  },
  {
    label: "WTZ",
    value: "WTZ",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc36",
    icon: "https://services.tzkt.io/v1/avatars/KT1PnUZCp3u2KzWr93pn4DD7HAJnm3rWVrgn",
  },
  {
    label: "wUSDC",
    value: "wUSDC",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc37",
    icon: "https://thumbs.dipdup.net/QmQfHU9mYLRDU4yh2ihm3zrvVFxDrLPiXNYtMovUQE2S2t",
  },
];

const optionsInRef = ref(options);
const optionsOutRef = ref(
  options.filter((o) => {
    return o.value !== "CTez";
  })
);

const tokenIn = ref<any>(null);
const tokenOut = ref<any>(null);

const amountIn = ref(null);
const amountOut = ref(null);

const updateTokenIn = (val: any) => {
  optionsOutRef.value = options.filter((o) => {
    return o.value !== val.value;
  });

  tokenIn.value = val;
};
</script>
