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
    <manage-pool @PoolDialogClose="closePoolDialog" :pool="selectedPool" />
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  poolsList?: unknown[];
  pending?: boolean;
  error?: Error | null;
}>();

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
