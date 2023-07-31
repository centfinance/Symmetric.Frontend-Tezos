<template>
  <div>
    <q-select
      v-model="value"
      rounded
      outlined
      dark
      color="orange"
      use-input
      input-class="hidden focus:ring-0 focus:ring-offset-0 text-2xl"
      input-debounce="0"
      :options="optionsRef"
      @filter="filterFn"
      behavior="dialog"
    >
      <template v-slot:prepend>
        <q-avatar v-if="value">
          <q-img :src="value.icon" spinner-color="white" />
        </q-avatar>
      </template>
      <!-- <template v-slot:before-options>
        <q-item>
          <q-item-section class="text-grey"> Hi I'm before </q-item-section>
        </q-item>
      </template> -->
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
  options: any[];
  modelValue: any;
}>();

const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const optionsRef = ref(props.options);

const filterFn = (val: any, update: any) => {
  if (val === "") {
    update(() => {
      optionsRef.value = props.options;
    });
    return;
  }

  update(() => {
    console.log(val);
    const needle = val.toLowerCase();
    console.log(
      props.options.filter((v) => v.value.toLowerCase().indexOf(needle) > -1)
    );
    optionsRef.value = props.options.filter(
      (v) => v.value.toLowerCase().indexOf(needle) > -1
    );
  });
};
</script>
<style>
div.q-field__control-container.col.relative-position.row.no-wrap.q-anchor--skip
  > div.q-field__label.no-pointer-events.absolute.ellipsis {
  max-width: fit-content !important;
}
</style>
