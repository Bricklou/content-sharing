<script setup lang="ts">
import { FunctionalComponent } from "vue";

export type DropdownItemType = {
  title: string;
  icon?: FunctionalComponent;
  description?: string;
  condition?: () => boolean;
} & AllXOR<[{ action: () => void }, { to: string; external?: boolean }]>;

defineProps<{ item: DropdownItemType }>();
</script>

<template>
  <button
    type="button"
    class="button"
    role="menuitem"
    @click="item.action"
    v-if="item.hasOwnProperty('action')"
  >
    <component v-if="item.icon" :is="item.icon" class="mr-4" />

    <span class="grid grid-cols-1 grid-flow-col">
      <span class="row-start-1" v-text="item.title" />
      <span
        class="text-xs text-gray-400 row-start-2"
        v-if="item.description"
        v-text="item.description"
      />
    </span>
  </button>

  <a class="button" role="menuitem" v-else-if="item.external" :href="item.to">
    <component v-if="item.icon" :is="item.icon" class="mr-4" />

    <span class="grid grid-cols-1 grid-flow-col">
      <span class="row-start-1" v-text="item.title" />
      <span
        class="text-xs text-gray-400 row-start-2"
        v-if="item.description"
        v-text="item.description"
      />
    </span>
  </a>

  <router-link class="button" role="menuitem" :to="item.to" v-else>
    <component v-if="item.icon" :is="item.icon" class="mr-4" />

    <span class="grid grid-cols-1 grid-flow-col">
      <span class="row-start-1" v-text="item.title" />
      <span
        class="text-xs text-gray-400 row-start-2"
        v-if="item.description"
        v-text="item.description"
      />
    </span>
  </router-link>
</template>

<style scoped lang="postcss">
.button {
  @apply flex items-center mx-2 px-2 py-2 rounded text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 text-left;
}
</style>
