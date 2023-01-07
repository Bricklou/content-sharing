<script lang="ts" setup>
import NavBar from "./components/parts/NavBar.vue";
import { useTheme } from "./store/reducer/theme.slice";
import { useSelector } from "./store";
import { useTranslation } from "i18next-vue";

const { currentTheme } = useTheme();
const { t } = useTranslation();
const isLoaded = useSelector((s) => s.app.isLoaded);

if (currentTheme.value === "dark") {
  const htmlEl = document.getElementsByTagName("html")[0];
  if (htmlEl) {
    htmlEl.classList.add("dark");
  }
}
</script>

<template>
  <template v-if="isLoaded">
    <nav-bar class="m-4" />
    <router-view />
  </template>

  <p v-else v-text="t('app.loading')" />
</template>

<style lang="postcss" scoped></style>
