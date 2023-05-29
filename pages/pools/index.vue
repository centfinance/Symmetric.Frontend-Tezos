<template>
  <div>
    <div class="grid w-full grid-cols-12">
      <div class="col-span-12 w-full md:col-span-8 q-pa-md">
        <div class="text-3xl font-bold">TVL</div>
        <div class="text-6xl font-extrabold">$1,000,634</div>
      </div>
      <div class="col-span-12 w-full md:col-span-4 q-pa-md">
        <div class="text-3xl font-bold">Volume (24h)</div>
        <div class="text-6xl font-extrabold">$15,043,564</div>
      </div>
      <div class="col-span-12 w-full md:col-span-12 mt-4">
        <PoolsList />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { graphql } from "~/gql";
</script>
