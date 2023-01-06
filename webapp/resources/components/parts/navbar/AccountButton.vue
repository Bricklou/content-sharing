<script setup lang="ts">
import { defineProps, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useTranslation } from "i18next-vue";
import type { User } from "@/types/user";
import { User as UserIcon } from "lucide-vue-next";
import DropdownMenu from "@/components/parts/navbar/DropdownMenu.vue";

const props = defineProps<{ user: User }>();
const data = reactive({ menuOpen: false });
const $el = ref<HTMLDivElement>();
const { t } = useTranslation();

function toggleMenu() {
  data.menuOpen = !data.menuOpen;
}

onMounted(() => {
  document.addEventListener("click", close);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", close);
});

function close(e: Event) {
  if (e.target instanceof HTMLElement && !$el.value?.contains(e.target)) {
    data.menuOpen = false;
  }
}
</script>

<template>
  <div ref="$el">
    <button
      type="button"
      class="relative block ml-4"
      @click.passive="toggleMenu"
    >
      <img
        v-if="props.user.avatar != null"
        :alt="
          t('components.navbar.avatar_alt', {
            username: props.user.username,
          })
        "
        :src="user.avatar"
        class="mx-auto object-cover rounded-full h-10 w-10"
      />
      <UserIcon v-else />
    </button>

    <dropdown-menu :is-open="data.menuOpen" @close="data.menuOpen = false" />
  </div>
</template>
