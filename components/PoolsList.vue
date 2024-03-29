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
          column-sort-order="da"
          table-header-class="font-bold"
        >
          <template v-slot:top="props">
            <div class="flex flex-row w-full justify-between pt-2">
              <div class="font-bold text-2xl">Pools</div>
              <div class="flex gap-2">
                <q-btn
                  dark
                  dense
                  outline
                  rounded
                  icon="refresh"
                  @click="refresh"
                />
                <q-btn
                  dark
                  dense
                  outline
                  rounded
                  icon="add"
                  to="/pools/create"
                />
              </div>
            </div>
          </template>
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="composition" :props="props">
                <div class="grid grid-cols-12 grid-flow-col auto-cols-min">
                  <div class="col-span-4">
                    <q-avatar
                      v-for="(t, i) in props.row.icons"
                      :key="i"
                      size="35px"
                      class="bg-black"
                      :style="`left: ${i * -15}px`"
                    >
                      <q-img :src="props.row.icons[i]" />
                    </q-avatar>
                  </div>
                  <div class="col-span-8 flex flex-wrap gap-y-1">
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
                </div>
              </q-td>
              <q-td key="swap_fee" :props="props">
                {{ props.row.swap_fee }}%
              </q-td>
              <q-td key="total_liquidity" :props="props">
                {{ USDollar.format(props.row.total_liquidity) }}
              </q-td>
              <q-td key="total_swap_volume" :props="props">
                {{ props.row.total_swap_volume }}
              </q-td>
              <q-td>
                <q-btn
                  label="Manage"
                  :disable="!wallet"
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
import { Wallet } from "~/store/models/Wallet";
import { PoolRepository } from "~/store/repositories/PoolRepository";

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
    name: "swap_fee",
    field: "swap_fee",
    label: "Swap Fee",
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

let USDollar = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const wallet = computed(() => useRepo(Wallet).all()[0]);

const selectedPool = ref<string | null>(null);

const openPoolDialog = (pool: string) => {
  selectedPool.value = pool;
};

const closePoolDialog = () => {
  selectedPool.value = null;
};

const refresh = async () => {
  await useRepo(PoolRepository).fetchPoolData();
};
</script>
