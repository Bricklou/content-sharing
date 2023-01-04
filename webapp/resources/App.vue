<script lang="ts" setup>
import NavBar from "./components/parts/NavBar.vue";
import { useTheme } from "./store/reducer/theme.slice";
import { onBeforeMount, reactive } from "vue";
import { useDispatch } from "./store";
import { refreshUser } from "./store/reducer/auth.slice";
import { useTranslation } from "i18next-vue";

const { currentTheme } = useTheme();
const { t } = useTranslation();

if (currentTheme.value === "dark") {
  const htmlEl = document.getElementsByTagName("html")[0];
  if (htmlEl) {
    htmlEl.classList.add("dark");
  }
}

const data = reactive({ loading: true });

onBeforeMount(() => {
  const dispatch = useDispatch();

  dispatch(refreshUser()).finally(() => {
    data.loading = false;
  });
});
</script>

<template>
  <template v-if="!data.loading">
    <nav-bar class="m-4" />
    <router-view />
  </template>
  <template v-else>{{ t("app.loading") }}</template>
</template>

<style lang="postcss" scoped></style>
