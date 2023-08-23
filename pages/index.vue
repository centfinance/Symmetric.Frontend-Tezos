<template>
  <div class="p-6">...loading</div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";

onMounted(() => {
  useRouter().push("/swap");
});
</script>
