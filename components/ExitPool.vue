<template>
  <div class="q-pa-sm">
    <div class="flex flex-row justify-between gap-x-1 mx-4 my-1">
      <div class="place-self-end font-bold">How much to withdraw?</div>
      <div>
        <q-btn outline dense label="25%" @click="onPercentageChange(25)" />
        <q-btn outline dense label="50%" @click="onPercentageChange(50)" />
        <q-btn outline dense label="75%" @click="onPercentageChange(75)" />
      </div>
    </div>
    <div class="pb-2">
      <q-input
        ref="inputRef"
        dark
        outlined
        dense
        item-aligned
        color="white"
        v-model="inputValue"
        placeholder="0.00"
        type="number"
        step="0.01"
        input-class="focus:ring-0 focus:ring-offset-0"
        :rules="[
            (val) => val > 0 || 'No amount entered',
            (val) =>
              val <= pool!.normalizedLPBalance() ||
              'Not enough Balance',
          ]"
        lazy-rules="ondemand"
        no-error-icon
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
      <div class="text-center text-md font-bold pb-1">
        You will receive at least:
      </div>
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
                {{ estAmounts[token.index] }}
                <br />
                <span class="text-xs font-thin grey">{{ token.symbol }}</span>
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
  <q-card-actions align="center">
    <q-btn
      :loading="loading"
      color="black"
      spread
      no-caps
      text-color="white"
      class="full-width bg-black"
      label="Remove Liquidity"
      @click="onConfirm"
    >
      <template v-slot:loading>
        <q-spinner-hourglass class="on-left" />
        Sending...
      </template>
    </q-btn>
  </q-card-actions>
</template>
<script lang="ts" setup>
import { BigNumber } from "bignumber.js";
import { Pool } from "~/store/models/Pool";
import numbro from "numbro";
import { Wallet } from "~/store/models/Wallet";

const props = defineProps<{
  pool?: string | null;
}>();

const pool = computed(() => {
  if (props.pool) {
    return useRepo(Pool).with("pool_tokens").find(props.pool);
  }
  return null;
});

const inputRef = ref<any>(null);
const inputValue = ref<string | undefined>(undefined);

const loading = ref(false);

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
console.log(balances.value![0].balance.toString());

const proportionalAmounts = computed(() => {
  const amountsOut = computeProportionalAmountsOut(
    BigNumber(inputValue.value!).multipliedBy(10 ** 18),
    BigNumber(pool.value?.pool_shares),
    balances.value!
  );
  return amountsOut;
});

const estAmounts = computed(() => {
  if (!inputValue.value || isNaN(parseInt(inputValue.value!))) {
    return new Array(pool.value?.pool_tokens.length).fill("0.00");
  }
  const amountsOut = computeProportionalAmountsOut(
    BigNumber(inputValue.value!).multipliedBy(10 ** 18),
    BigNumber(pool.value?.pool_shares),
    balances.value!
  );
  return amountsOut.map((a) =>
    numbro(a.amount).format({
      average: true,
      totalLength: 6,
    })
  );
});

const onConfirm = async () => {
  loading.value = true;
  try {
    const amounts = proportionalAmounts.value.map((v) => {
      return {
        index: v.index,
        amount: BigNumber(v.amount.toFixed(18)).multipliedBy(10 ** 18),
      };
    });
    inputRef.value!.validate();
    const tezos = await dappClient().tezos();
    const client = await dappClient().getDAppClient();
    const account = await client.getActiveAccount();
    const wallet = useRepo(Wallet).find(account!.address);
    const request = await createExitRequest(
      tezos,
      pool.value!,
      BigNumber(BigNumber(inputValue.value!).toFixed(18)).multipliedBy(
        10 ** 18
      ),
      amounts,
      wallet?.slippage!
    );

    const tx = await request!.send();
    const confirmation = await tx.confirmation();
    console.log(confirmation);
    // reset inputs
    // display confirmation
  } catch (e: any) {
    console.log(e);
  }
  loading.value = false;
};
</script>
