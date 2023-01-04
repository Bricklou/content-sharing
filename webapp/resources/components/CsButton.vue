<script setup lang="ts">
interface IProps {
  type?: HTMLButtonElement["type"];
  class?: string;
}

const props = defineProps<IProps>();
</script>

<template>
  <button
    :type="props.type || 'button'"
    :class="props.class"
    class="inline-flex items-center justify-center py-2 px-4 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
  >
    <slot />
  </button>
</template>

<style scoped></style>
