<template>
  <!-- <div class="flex flex-col">
    <div v-if="loading" class="text-lg">Loading...</div>
    <div v-else-if="error" class="text-red-500">
      An error occurred: {{ error.message }}
    </div>
    <div v-else class="space-y-4"> -->
  <div class="q-pa-md">
    <q-table
      flat
      title="Pools"
      dark
      :rows="pools"
      :columns="columns"
      row-key="name"
      separator="none"
    >
      <template v-slot:body="props">
        <!-- <NuxtLink to="/pool/address"> -->
        <q-tr :props="props" @click="onPoolClick(props.row.address)">
          <q-td key="composition" :props="props">
            <q-badge
              v-for="token in props.row.composition"
              key="token"
              color="black"
              class="mx-1"
            >
              {{ token.symbol }}
              {{ token.weight }}
            </q-badge>
          </q-td>
          <q-td key="total_liquidity" :props="props">
            {{ props.row.total_liquidity }}
          </q-td>
          <q-td key="total_swap_volume" :props="props">
            {{ props.row.total_swap_volume }}
          </q-td>
        </q-tr>
        <!-- </NuxtLink> -->
      </template>
    </q-table>
  </div>
  <!-- </div>
  </div> -->
</template>
<script lang="ts" setup>
import { graphql } from "~/gql";

const columns = [
  {
    name: "composition",
    field: "composition",
    label: "Composition",
    sortable: false,
    align: "left",
  },
  {
    name: "total_liquidity",
    field: "total_liquidity",
    label: "Liquidity",
    sortable: true,
  },
  {
    name: "total_swap_volume",
    field: "total_swap_volume",
    label: "Total Volume",
    sortable: true,
  },
];

const poolsListQuery = graphql(`
  query GetPool {
    indexer_pool(order_by: { total_liquidity: desc }) {
      holders_count
      swaps_count
      swap_enabled
      address
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
        decimals
        name
        symbol
        token_id
        weight
        id
        pool_token_id
      }
    }
  }
`);
const { loading, result, error } = useQuery(poolsListQuery);
type Composition = {
  symbol: string;
  weight: any;
};
type Pool = {
  composition: Composition[];
  total_liquidity: any;
  total_swap_volume: any;
  address: string;
};
const poolsInit: Array<Pool> = [];
const pools = ref(poolsInit);

if (result.value && result.value.indexer_pool) {
  const rows = result.value.indexer_pool.map((pool) => {
    console.log(pool.pool_tokens);
    return {
      composition: pool.pool_tokens.map((token) => {
        return {
          symbol: token.symbol,
          weight: `${token.weight / (10 * 10 ** 15)}%`,
        };
      }),
      total_liquidity: pool.total_liquidity,
      total_swap_volume: pool.total_swap_volume,
      address: pool.address,
    };
  });
  console.log(rows);
  pools.value = rows;
}

const onPoolClick = (address: string) => {
  const router = useRouter();
  router.push(`/pools/${address}`);
};
</script>
