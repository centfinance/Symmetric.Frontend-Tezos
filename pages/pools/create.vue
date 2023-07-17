<template>
  <div class="q-pa-md">
    <q-stepper v-model="step" dark vertical color="primary" animated>
      <q-step :name="1" title="Select Tokens" icon="settings" :done="step > 1">
        <div>
          <q-select
            filled
            dark
            v-model="tokens"
            :options="options"
            label="Select Tokens"
            counter
            max-values="8"
            hint="Max 8 tokens"
            multiple
            map-options
            use-chips
          >
            <template
              v-slot:option="{ itemProps, opt, selected, toggleOption }"
            >
              <q-item v-bind="itemProps">
                <q-item-section>
                  <q-item-label v-html="opt.label" />
                </q-item-section>
                <q-item-section side>
                  <q-toggle
                    :model-value="selected"
                    @update:model-value="toggleOption(opt)"
                  />
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>

        <q-stepper-navigation>
          <q-btn @click="step = 2" color="primary" label="Continue" />
        </q-stepper-navigation>
      </q-step>

      <q-step
        :name="2"
        title="Select Token Weights"
        caption="Optional"
        icon="acale"
        :done="step > 2"
      >
        <div class="grid grid-rows-2 grid-flow-col gap-4">
          <div v-for="token in tokens">
            {{ token.value }}
            <q-input
              filled
              dark
              v-model="price"
              mask="##.##################"
              fill-mask="0"
              reverse-fill-mask
              hint="Mask: #.##"
              input-class="text-right"
            />
          </div>
        </div>

        <q-stepper-navigation>
          <q-btn @click="step = 3" color="primary" label="Continue" />
          <q-btn
            flat
            @click="step = 1"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="3" title="Set Swap Fee" icon="assignment">
        <q-input
          filled
          dark
          v-model="price"
          type="number"
          fill-mask="0"
          reverse-fill-mask
          hint="Max 10%"
          input-class="text-right"
        />
        <q-stepper-navigation>
          <q-btn @click="step = 4" color="primary" label="Continue" />
          <q-btn
            flat
            @click="step = 1"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>

      <q-step :name="4" title="Add Initial Liquidity" icon="add_comment">
        Try out different ad text to see what brings in the most customers, and
        learn how to enhance your ads using features like ad extensions. If you
        run into any problems with your ads, find out how to tell if they're
        running and how to resolve approval issues.

        <q-stepper-navigation>
          <q-btn color="primary" label="Finish" />
          <q-btn
            flat
            @click="step = 3"
            color="primary"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script lang="ts" setup>
const step = ref(1);

const tokens = ref(null);
const options = ref([
  {
    label: "CTEZ",
    value: "CTEZ",
  },
  {
    label: "SYMM",
    value: "SYMM",
  },
  {
    label: "SIRS",
    value: "SIRS",
  },
  {
    label: "TZBTC",
    value: "TZBTC",
  },
  {
    label: "EURL",
    value: "EURL",
  },
  {
    label: "KUSD",
    value: "KUSD",
  },
  {
    label: "WTZ",
    value: "WTZ",
  },
  {
    label: "WUSDC",
    value: "WUSDC",
  },
]);
</script>
