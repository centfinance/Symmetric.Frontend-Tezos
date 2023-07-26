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
          @update:model-value="calculatePrice(token.symbol, token.index)"
          :rules="[
            (val: any) => val > 0 || 'No amount entered',
            (val: any) =>
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
              {{
                prices[token.index].value
                  ? USDollar.format(prices[token.index].value!)
                  : ""
              }}
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
                  // calculateAmounts(token.index);
                  calculatePrice(token.symbol, token.index);
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
        <div v-if="loading || confirmationRef" class="p-4 mt-8 bg-gray-900">
          <div
            class="p-4 flex flex-col text-2xl items-center gap-2"
            v-if="confirmationRef"
          >
            <div>Liquidity Added 🎉</div>
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
import { BigNumber } from "bignumber.js";
import config from "~/config/config";
import { Pool } from "~/store/models/Pool";
import { PoolToken } from "~/store/models/PoolToken";
import { Wallet } from "~/store/models/Wallet";
import { PoolRepository } from "~/store/repositories/PoolRepository";

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
      address: t.address,
      token_id: t.pool_token_id,
      symbol: t.symbol,
      decimal: t.decimals,
      index: t.index,
      priceRate: 1,
      amount: "0",
    };
  })
);

console.log(tokens);

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
const prices = tokens.value?.map((t) => ref<number | undefined>(undefined));

let USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const calculatePrice = (symbol: string, i: number) => {
  if (symbol in config.mockPriceData) {
    if (amounts[i].value && !isNaN(parseInt(amounts[i].value!))) {
      const price = BigNumber(amounts[i].value!).multipliedBy(
        config.mockPriceData[symbol]
      );
      prices[i].value = price.toNumber();
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
const confirmationRef = ref<any>(null);

const addLiquidity = async () => {
  loading.value = true;
  try {
    inputRefs.value.forEach((input, i) => input.value[i].validate());
    const client = await dappClient().getDAppClient();
    const account = await client.getActiveAccount();
    const wallet = useRepo(Wallet).find(account!.address);

    const tokens = poolTokens.value!.map((t) => {
      return {
        address: t.address,
        id: t.FA2 ? t.pool_token_id : null,
        decimals: t.decimals,
        index: t.index,
      };
    });

    const tx = await useJoinPool(
      { address: pool.value!.address, id: pool.value!.poolId },
      amounts.map((a, i) => [i, BigNumber(a.value!)]),
      tokens,
      parseInt(wallet?.slippage!) / 100,
      pool.value!.pool_shares == 0 ? true : false
    );

    const confirmation = await tx.confirmation();
    console.log(confirmation);
    confirmationRef.value = confirmation.block;
    amounts.forEach((a, i) => (amounts[i].value = undefined));
    useRepo(PoolRepository).fetchPoolData();
  } catch (e: any) {
    console.log(e);
  }

  loading.value = false;
};
</script>
