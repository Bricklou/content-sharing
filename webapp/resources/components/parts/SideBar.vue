<script setup lang="ts">
import { FolderPlus, Plus } from "lucide-vue-next";
import CsButton from "@/components/CsButton.vue";
</script>

<template>
  <div
    class="relative bg-white min-h-full rounded dark:bg-gray-700 sidebar fixed md:block rounded-md m-4 p-6 pt-4 w-80 overflow-y-auto"
  >
    <header class="flex items-center justify-between mb-2">
      <h1 class="uppercase flex-1 text-gray-500 dark:text-gray-200">
        My Pages
      </h1>
      <div class="inline-flex space-x-1">
        <cs-button
          colors="bg-transparent hover:bg-gray-200 dark:hover:bg-gray-600"
          class="shadow-none w-10 h-10 px-0 py-0"
        >
          <Plus class="w-5 h-5" />
        </cs-button>
        <cs-button
          colors="bg-transparent hover:bg-gray-200 dark:hover:bg-gray-600"
          class="shadow-none w-10 h-10 px-0 py-0"
        >
          <FolderPlus class="w-5 h-5" />
        </cs-button>
      </div>
    </header>
    <div class="md:px-2 flex flex-col">
      <button role="menuitem" class="item">
        <Plus class="mr-2 w-4 h4" />
        Add a new page
      </button>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.item {
  @apply inline-flex px-2 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md;

  &.router-link-active {
    @apply bg-indigo-400 text-white dark:bg-indigo-500;
  }
}
</style>
