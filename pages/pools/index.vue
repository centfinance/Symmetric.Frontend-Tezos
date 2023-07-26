<template>
  <div>
    <div class="grid w-full grid-cols-12">
      <div class="col-span-12 w-full md:col-span-8 q-pa-md">
        <div class="text-2xl font-bold">TVL</div>
        <div class="text-4xl font-extrabold">{{ totalLiquidity }}</div>
      </div>
      <div class="col-span-12 w-full md:col-span-4 q-pa-md">
        <div class="text-2xl font-bold">Volume (24h)</div>
        <div class="text-4xl font-extrabold">$15,043,564</div>
      </div>
      <div class="col-span-12 w-full md:col-span-12 mt-4">
        <PoolsList :poolsList="poolsList" :pending="pending" :error="error" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { graphql } from "~/gql";
import { PoolRepository } from "~/store/repositories/PoolRepository";

const poolsListQuery = graphql(`
  query GetPool {
    indexer_pool(order_by: { total_liquidity: desc }) {
      holders_count
      swaps_count
      swap_enabled
      address
      index
      factory
      id
      owner
      create_time
      swap_fee
      total_liquidity
      total_shares
      total_swap_fee
      total_swap_volume
      name
      pool_type
      symbol
      tokens_list
      pool_tokens {
        address
        balance
        index
        decimals
        name
        symbol
        token_id
        weight
        id
        pool_id
        pool_token_id
        token {
          fa2
        }
      }
    }
  }
`);

const { pending, data, error } = await useAsyncQuery(poolsListQuery);

if (data.value && data.value.indexer_pool) {
  useRepo(PoolRepository).store(data.value);
}

const totalLiquidity = computed(() => useRepo(PoolRepository).tvl());
const poolsList = computed(() => useRepo(PoolRepository).getPoolList());
</script>
