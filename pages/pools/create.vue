<template>
  <div class="q-pa-md">
    <q-stepper v-model="step" dark vertical color="primary" animated>
      <q-step :name="1" title="Select Tokens" icon="settings" :done="step > 1">
        <div>
          <q-select
            filled
            dark
            v-model="tokens"
            :options="options"
            label="Select Tokens"
            counter
            max-values="8"
            hint="Max 8 tokens"
            multiple
            map-options
            use-chips
          >
            <template
              v-slot:option="{ itemProps, opt, selected, toggleOption }"
            >
              <q-item v-bind="itemProps">
                <q-item-section>
                  <q-item-label v-html="opt.label" />
                </q-item-section>
                <q-item-section side>
                  <q-toggle
                    :model-value="selected"
                    @update:model-value="toggleOption(opt)"
                  />
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <q-stepper-navigation>
          <q-btn @click="onSelectTokens" color="primary" label="Continue" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Select Token Weights"
        caption="Optional"
        icon="acale"
        :done="step > 2"
      >
        <div class="grid grid-rows-2 grid-flow-col gap-4">
          <div v-for="(token, i) in tokens">
            {{ token.value }} {{ i }}
            <q-input
              filled
              dark
              suffix="%"
              v-model="weights[i].value"
              input-class="text-right focus:ring-0 focus:ring-offset-0"
            />
          </div>
        </div>

        <q-stepper-navigation>
          <q-btn @click="onSelectWeights" color="primary" label="Continue" />
          <q-btn
            flat
            @click="step = 1"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="3" title="Set Swap Fee" icon="assignment">
        <q-input
          filled
          dark
          ref="swapFeeInput"
          v-model="swapFee"
          type="number"
          fill-mask="0"
          reverse-fill-mask
          hint="Max 10%"
          input-class="text-right focus:ring-0 focus:ring-offset-0"
          :rules="[
            (val: any) => val > 0.01 || 'Swap Fee too low',
            (val: any) => val < 10 || 'Swap Fee too high',,
          ]"
          lazy-rules="ondemand"
        />
        <q-stepper-navigation>
          <q-btn @click="onSetSwapFee" color="primary" label="Continue" />
          <q-btn
            flat
            @click="step = 2"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="4" title="Add Initial Liquidity" icon="add_comment">
        Try out different ad text to see what brings in the most customers, and
        learn how to enhance your ads using features like ad extensions. If you
        run into any problems with your ads, find out how to tell if they're
        running and how to resolve approval issues.

        <q-stepper-navigation>
          <q-btn color="primary" label="Finish" />
          <q-btn
            flat
            @click="step = 3"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script lang="ts" setup>
import { BigNumber } from "bignumber.js";
import { useCreatePool } from "~/composables/useCreatePool";

const step = ref(1);

const tokens = ref<any>(null);
const options = ref([
  {
    label: "CTEZ",
    value: "CTEZ",
    address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
    id: 0,
    decimals: 18,
  },
  {
    label: "SYMM",
    value: "SYMM",
    address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
    id: 0,
    decimals: 18,
  },
  {
    label: "SIRS",
    value: "SIRS",
    address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
    id: 0,
    decimals: 18,
  },
  {
    label: "TZBTC",
    value: "TZBTC",
    address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
    id: 0,
    decimals: 18,
  },
  {
    label: "EURL",
    value: "EURL",
    address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
    id: 0,
    decimals: 18,
  },
  {
    label: "KUSD",
    value: "KUSD",
    address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
    id: 0,
    decimals: 18,
  },
  {
    label: "WTZ",
    value: "WTZ",
    address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
    id: 0,
    decimals: 18,
  },
  {
    label: "WUSDC",
    value: "WUSDC",
    address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
    id: 0,
    decimals: 18,
  },
]);

const a = new Array(8).fill(0);
const weights = a.map((i) => {
  return ref<string>("0");
});
console.log(weights);

const weightMap = {
  2: "50",
  3: "33.3333333333333333",
  4: "25",
  5: "20",
  6: "16.6666666667",
  7: "14.2857142857",
  8: "12.5",
};

const swapFee = ref(0.5);
const swapFeeInput = ref<any>(null);

const onSelectTokens = () => {
  if (!tokens.value || tokens.value.length < 2) {
    console.log("select at lest two tokens");
  }
  const weight: any = weightMap[tokens.value.length];

  tokens.value.forEach((t: any, i: any) => {
    console.log(i);
    weights[i].value = weight;
  });

  if (tokens.value.length === 3) {
    weights[2].value = "33.3333333333333334";
  }

  console.log(weights);

  step.value = 2;
};

const onSelectWeights = () => {
  let totalWeight = BigNumber(0);

  tokens.value.forEach((t: any, i: any) => {
    console.log(weights[i].value, i);
    totalWeight = totalWeight.plus(weights[i].value);
  });

  console.log(totalWeight.toNumber());
  if (totalWeight.toString() === "100") {
    step.value = 3;
  }
};

const onSetSwapFee = async () => {
  swapFeeInput.value!.validate();
  try {
    const t = tokens.value.map((t: any) => {
      return {
        address: t.address,
        id: t.id,
        decimals: t.decimals,
      };
    });

    console.log(
      weights.map((w) =>
        BigNumber(BigNumber(w.value).toFixed(18))
          .multipliedBy(10 ** 16)
          .toString()
      )
    );
    const tx = await useCreatePool(
      t,
      weights.map((w: any) => w.value),
      BigNumber(swapFee.value)
    );
    const confirmation = await tx?.confirmation();
    console.log(confirmation);
    step.value = 4;
  } catch (e: any) {}
};
</script>
