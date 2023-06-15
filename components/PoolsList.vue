<template>
  <div class="flex flex-col">
    <div v-if="pending" class="text-lg">Loading...</div>
    <div v-else-if="error" class="text-red-500">
      An error occurred: {{ error.message }}
    </div>
    <div v-else class="space-y-4">
      <div class="q-pa-md">
        <q-table
          flat
          title="Pools"
          dark
          :rows="poolsList"
          :columns="columns"
          row-key="name"
          separator="none"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td :props="props">
                <q-avatar
                  v-for="(t, i) in props.row.icons"
                  :key="i"
                  size="40px"
                  class="overlapping"
                  :style="`left: ${i * 25}px`"
                >
                  <q-img :src="props.row.icons[i]" />
                </q-avatar>
              </q-td>
              <q-td key="composition" :props="props">
                <div class="flex flex-wrap gap-y-1">
                  <q-badge
                    v-for="token in props.row.composition"
                    key="token"
                    color="black"
                    class="mx-1"
                  >
                    {{ token.symbol }}
                    {{ token.weight }}
                  </q-badge>
                </div>
              </q-td>
              <q-td key="total_liquidity" :props="props">
                {{ props.row.total_liquidity }}
              </q-td>
              <q-td key="total_swap_volume" :props="props">
                {{ props.row.total_swap_volume }}
              </q-td>
              <q-td>
                <q-btn
                  label="Manage"
                  no-caps
                  color="black"
                  @click="openPoolDialog(props.row.address)"
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
    <manage-pool
      v-if="selectedPool"
      @PoolDialogClose="closePoolDialog"
      :pool="selectedPool"
    />
  </div>
</template>
<script lang="ts" setup>
type PoolsList = {
  composition: { symbol: string; weight: string }[];
  total_liquidity: number;
  total_swap_volume: number;
  address: string;
  icons: string[];
}[];

const props = defineProps<{
  poolsList?: PoolsList;
  pending?: boolean;
  error?: Error | null;
}>();

console.log(props.poolsList);
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

const onPoolClick = (address: string) => {
  const router = useRouter();
  router.push(`/pools/${address}`);
};

const selectedPool = ref<string | null>(null);

const openPoolDialog = (pool: string) => {
  selectedPool.value = pool;
};

const closePoolDialog = () => {
  selectedPool.value = null;
};
</script>
