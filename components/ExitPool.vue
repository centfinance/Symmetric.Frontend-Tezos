<template>
  <q-card-section>
    <div class="flex flex-row justify-end gap-x-1 mx-4 my-1">
      <q-btn outline dense label="25%" @click="onPercentageChange(25)" />
      <q-btn outline dense label="50%" @click="onPercentageChange(50)" />
      <q-btn outline dense label="75%" @click="onPercentageChange(75)" />
    </div>
    <div>
      <q-input
        dark
        borderless
        item-aligned
        v-model="inputValue"
        placeholder="0.00"
        type="number"
        step="0.01"
        input-class="focus:ring-0 focus:ring-offset-0"
      >
        <template v-slot:after>
          <div class="my-1">
            <q-btn
              dense
              color="orange"
              outline
              @click="onPercentageChange(100)"
            >
              <div class="row items-center no-wrap">
                <q-icon left name="wallet" />
                <div class="text-center leading-4">
                  {{ pool?.symbol }}
                  <br />
                  {{ pool?.formatLPBalance() }}
                </div>
              </div>
            </q-btn>
          </div>
        </template>
      </q-input>
    </div>
    <div>
      <div class="text-center text-md font-bold">You will receive:</div>
      <div class="grid grid-cols-2 gap-3">
        <q-card
          dark
          flat
          bordered
          v-for="token in pool?.pool_tokens"
          key="token"
        >
          <q-card-section horizontal>
            <div class="flex justify-center items-center">
              <q-avatar size="75px">
                <q-img class="col-5" :src="token.icon" />
              </q-avatar>
            </div>

            <q-card-section>
              <div class="text-sm font-bold">
                {{ estAmounts[token.index].amount }}
                <br />
                <span class="text-xs font-thin grey">{{ token.symbol }}</span>
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-card-section>
  <q-card-actions align="center">
    <q-btn
      flat
      no-caps
      text-color="white"
      class="full-width bg-black"
      label="Remove Liquidity"
      @click="onConfirm"
    />
  </q-card-actions>
</template>
<script lang="ts" setup>
import { BigNumber } from "bignumber.js";
import { Pool } from "~/store/models/Pool";

const props = defineProps<{
  pool?: string | null;
}>();

const pool = computed(() => {
  if (props.pool) {
    return useRepo(Pool).with("pool_tokens").find(props.pool);
  }
  return null;
});

const inputValue = ref<string | undefined>(undefined);

const onPercentageChange = (value: any) => {
  const input = BigNumber(pool.value?.userLPBalance)
    .dividedBy(100)
    .multipliedBy(value)
    .dividedBy(10 ** 18);

  inputValue.value = input.toString();
};

const balances = computed(() =>
  pool.value?.pool_tokens.map((t) => {
    return {
      balance: BigNumber(t.balance),
      index: t.index,
    };
  })
);
console.log(balances);

const estAmounts = computed(() => {
  const amountsOut = computeProportionalAmountsOut(
    BigNumber(inputValue.value!).multipliedBy(10 ** 18),
    BigNumber(pool.value?.pool_shares),
    balances.value!
  );
  return amountsOut;
});

const onConfirm = () => {};
</script>
