<template>
  <div>
    <q-select
      rounded
      outlined
      dark
      v-model="model"
      use-input
      input-class="focus:ring-0 focus:ring-offset-0"
      input-debounce="0"
      :label="props.label"
      :options="optionsRef"
      @filter="filterFn"
      behavior="dialog"
    >
      <template v-slot:prepend>
        <q-avatar v-if="model">
          <q-img :src="model.icon" spinner-color="white" />
        </q-avatar>
      </template>
      <template v-slot:before-options>
        <q-item>
          <q-item-section class="text-grey"> Hi I'm before </q-item-section>
        </q-item>
      </template>
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey"> No results </q-item-section>
        </q-item>
      </template>
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section avatar>
            <q-img :src="scope.opt.icon" spinner-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.opt.label }}</q-item-label>
            <q-item-label caption>{{ scope.opt.description }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps<{
  label: string;
  default?: string;
}>();

const options = [
  {
    label: "CTez",
    value: "CTez",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc30",
    icon: "https://thumbs.dipdup.net/Qme4ybadbY4H84h5WLPjdo47YQUxxVoJHWZrwYq2JZriM4",
  },
  {
    label: "Symmetric",
    value: "SYMM",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc31",
    icon: "https://assets.coingecko.com/coins/images/18525/small/SYMM-Coin-2.png?1632276841",
  },
  {
    label: "SIRS",
    value: "SIRS",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc32",
    icon: "https://services.tzkt.io/v1/avatars/KT1AafHA1C1vk959wvHWBispY9Y2f3fxBUUo",
  },
  {
    label: "tzBTC",
    value: "tzBTC",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc33",
    icon: "https://services.tzkt.io/v1/avatars/KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn",
  },
  {
    label: "EURL",
    value: "EURL",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc34",
    icon: "https://services.tzkt.io/v1/avatars/KT1JBNFcB5tiycHNdYGYCtR3kk6JaJysUCi8",
  },
  {
    label: "KUSD",
    value: "KUSD",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc35",
    icon: "https://services.tzkt.io/v1/avatars/KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV",
  },
  {
    label: "WTZ",
    value: "WTZ",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc36",
    icon: "https://services.tzkt.io/v1/avatars/KT1PnUZCp3u2KzWr93pn4DD7HAJnm3rWVrgn",
  },
  {
    label: "wUSDC",
    value: "wUSDC",
    description: "KT1JA3UQ6R4C84mH3FqS3G5mKFeEdLumrDc37",
    icon: "https://thumbs.dipdup.net/QmQfHU9mYLRDU4yh2ihm3zrvVFxDrLPiXNYtMovUQE2S2t",
  },
];

const defaultVal = computed(() => {
  if (props.default) {
    return options.find((o) => o.value == props.default);
  }
  return null;
});

const model = ref<any>(defaultVal);
const optionsRef = ref(options);

const filterFn = (val: any, update: any) => {
  if (val === "") {
    update(() => {
      optionsRef.value = options;
    });
    return;
  }

  update(() => {
    console.log(val);
    const needle = val.toLowerCase();
    console.log(
      options.filter((v) => v.value.toLowerCase().indexOf(needle) > -1)
    );
    optionsRef.value = options.filter(
      (v) => v.value.toLowerCase().indexOf(needle) > -1
    );
  });
};
</script>
