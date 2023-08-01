<template>
  <div class="q-pa-md">
    <q-stepper
      v-model="step"
      dark
      flat
      vertical
      done-color="white"
      active-color="orange"
      animated
    >
      <q-step :name="1" title="Select Tokens" prefix="1" :done="step > 1">
        <div>
          <q-select
            ref="selectInput"
            filled
            dark
            v-model="tokens"
            :options="options"
            color="orange"
            label="Select Tokens"
            counter
            max-values="8"
            hint="Max 8 tokens"
            multiple
            map-options
            use-chips
            :rules="[
              (val: any) => val || 'Please select at least 2 tokens',
              (val: any) => val.length > 1 || 'Please select at least 2 tokens',
            ]"
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
                    color="orange"
                    @update:model-value="toggleOption(opt)"
                  />
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <q-stepper-navigation>
          <q-btn
            @click="onSelectTokens"
            no-caps
            color="orange"
            label="Continue"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Select Token Weights"
        prefix="2"
        :done="step > 2"
      >
        <div class="grid grid-rows-2 grid-flow-col gap-4">
          <div v-for="(token, i) in tokens">
            {{ token.value }} {{ i }}
            <q-input
              filled
              dark
              color="orange"
              suffix="%"
              v-model="weights[i].value"
              input-class="text-right focus:ring-0 focus:ring-offset-0"
            />
          </div>
        </div>

        <q-stepper-navigation>
          <q-btn
            @click="onSelectWeights"
            no-caps
            color="orange"
            label="Continue"
          />
          <q-btn
            flat
            no-caps
            @click="step = 1"
            color="orange"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="3" title="Set Swap Fee" prefix="3" :done="step > 3">
        <q-input
          filled
          dark
          ref="swapFeeInput"
          v-model="swapFee"
          type="number"
          color="orange"
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
        <div v-if="loading || confirmationRef" class="p-4 mt-8 bg-gray-900">
          <div
            class="p-4 flex flex-col text-2xl items-center gap-2"
            v-if="confirmationRef && pool"
          >
            <div>Pool Created! 🎉</div>
            <div class="text-sm text-blue-500">
              <a
                :href="`https://ghostnet.tzkt.io/${
                  confirmationRef.operations.at(-1).at(-1).hash
                }`"
                target="_blank"
                >{{ confirmationRef.operations.at(-1).at(-1).hash }}</a
              >
            </div>
            <div>Pool address: {{ pool.address }}</div>
          </div>
          <q-skeleton v-if="loading" type="text"></q-skeleton>
        </div>
        <q-stepper-navigation>
          <div class="flex flex-row">
            <q-btn
              v-if="confirmationRef === null"
              :loading="loading"
              @click="onSetSwapFee"
              no-caps
              color="orange"
              label="Create Pool"
            />
            <q-btn
              v-else
              @click="step = 4"
              no-caps
              color="orange"
              label="Continue"
            />
            <div v-if="!loading && !confirmationRef">
              <q-btn
                flat
                @click="step = 2"
                no-caps
                color="orange"
                label="Back"
                class="q-ml-sm"
              />
            </div>
          </div>
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="4"
        title="Add Initial Liquidity"
        prefix="4"
        caption="Optional"
      >
        <div class="grid grid-cols-2 grid-flow-row gap-4">
          <div v-for="(token, i) in tokens">
            {{ i }}
            <q-input
              :ref="inputRefs[i]"
              filled
              dark
              color="orange"
              :suffix="token.value"
              placeholder="0.00"
              v-model="amounts[i].value"
              input-class="focus:ring-0 focus:ring-offset-0"
              :rules="[
                (val: any) => val > 0 || 'No amount entered',
                // (val: any) =>
                //   val <= poolTokens[token.index].normalizedBalance() ||
                //   'Not enough Balance',
              ]"
              lazy-rules="ondemand"
            />
          </div>
        </div>
        <div v-if="loading || addLiquidityConfirm" class="p-4 mt-8 bg-gray-900">
          <div
            class="p-4 flex flex-col text-2xl items-center gap-2"
            v-if="addLiquidityConfirm"
          >
            <div>Added Liquidity! 🎉</div>
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
        <q-stepper-navigation>
          <q-btn
            no-caps
            color="orange"
            label="Add Liqudity"
            @click="onAddLiquidity"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script lang="ts" setup>
import { BigNumber } from "bignumber.js";
import config from "~/config/config";
import { useCreatePool } from "~/composables/useCreatePool";
import { encodePubKey } from "@taquito/utils";

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
    id: 1,
    decimals: 18,
  },
  {
    label: "SIRS",
    value: "SIRS",
    address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
    id: 2,
    decimals: 18,
  },
  {
    label: "TZBTC",
    value: "TZBTC",
    address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
    id: 3,
    decimals: 18,
  },
  {
    label: "EURL",
    value: "EURL",
    address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
    id: 4,
    decimals: 18,
  },
  {
    label: "KUSD",
    value: "KUSD",
    address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
    id: 5,
    decimals: 18,
  },
  {
    label: "WTZ",
    value: "WTZ",
    address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
    id: 6,
    decimals: 18,
  },
  {
    label: "WUSDC",
    value: "WUSDC",
    address: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc3",
    id: 7,
    decimals: 18,
  },
]);

const a = new Array(8).fill(0);
const weights = a.map((i) => {
  return ref<string>("0");
});

const weightMap = {
  2: "50",
  3: "33.3333333333333333",
  4: "25",
  5: "20",
  6: "16.6666666667",
  7: "14.2857142857",
  8: "12.5",
};
const selectInput = ref<any>(null);
const swapFee = ref(0.5);
const swapFeeInput = ref<any>(null);
const amounts: Ref<string | undefined>[] = [];
const inputRefs = ref<Ref<any>[]>([]);

const onSelectTokens = () => {
  if (selectInput.value.validate()) {
    const weight: any = weightMap[tokens.value.length];

    tokens.value.forEach((t: any, i: any) => {
      weights[i].value = weight;
      amounts.push(ref(undefined));
      inputRefs.value.push(ref(null));
    });

    if (tokens.value.length === 3) {
      weights[2].value = "33.3333333333333334";
    }

    step.value = 2;
  } else {
  }
};

const onSelectWeights = () => {
  let totalWeight = BigNumber(0);

  tokens.value.forEach((t: any, i: any) => {
    console.log(weights[i].value, i);
    totalWeight = totalWeight.plus(weights[i].value);
  });

  if (totalWeight.toString() === "100") {
    step.value = 3;
  } else {
  }
};

const loading = ref(false);
const confirmationRef = ref<any>(null);

const pool = ref<{ address: string; id: any } | null>(null);

const onSetSwapFee = async () => {
  loading.value = true;
  if (swapFeeInput.value!.validate()) {
    try {
      const t = tokens.value.map((t: any) => {
        return {
          address: t.address,
          id: t.id,
          decimals: t.decimals,
        };
      });

      const tx = await useCreatePool(
        t,
        weights.map((w: any) => w.value),
        BigNumber(swapFee.value)
      );
      const confirmation = await tx?.confirmation();
      try {
        const tezos = await dappClient().tezos();
        const sub = tezos.stream.subscribeEvent({
          tag: "PoolRegistered",
          address: config.contracts.vault,
        });

        // rome-ignore lint/suspicious/noExplicitAny: <explanation>
        function getPoolId(data: any) {
          pool.value = {
            address: encodePubKey(data.payload.args[0].bytes),
            id: data.payload.args[1].args[1].int,
          };
          sub.close();
        }

        sub.on("data", getPoolId);
      } catch (e) {
        console.log(e);
      }
      console.log(confirmation);
      confirmationRef.value = confirmation!.block;
    } catch (e: any) {}
  }

  loading.value = false;
};
const addLiquidityConfirm = ref<any>(null);
const onAddLiquidity = async () => {
  loading.value = true;
  try {
    const valid = inputRefs.value.every((input, i) => {
      return input.value[0].validate();
    });
    if (valid) {
      const t = tokens.value.map((t: any, i: number) => {
        return {
          address: t.address,
          id: t.id,
          decimals: t.decimals,
          index: i,
        };
      });
      if (!pool || !pool.value) {
        const latestPool = await getLatestPoolId();
        if (latestPool.address && latestPool.id) {
          pool.value = latestPool as { address: string; id: any };
        }
      }
      const tx = await useJoinPool(
        pool.value!,
        amounts.map((a: any, i: number) => {
          return [i, BigNumber(a.value)];
        }),
        t,
        0.005,
        true
      );
      const hash = tx.opHash;
      await tx.confirmation();
      addLiquidityConfirm.value = hash;
      amounts.forEach((a, i) => (amounts[i].value = undefined));
    }
  } catch (e: any) {
    console.error(e);
  }
  loading.value = false;
};
</script>
