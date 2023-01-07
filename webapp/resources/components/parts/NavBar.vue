<script setup lang="ts">
import { Home, LogIn, Moon, Search, Sun } from "lucide-vue-next";
import { useDispatch } from "@/store";
import { toggleTheme, useTheme } from "@/store/reducer/theme.slice";
import { useAuth } from "@/store/reducer/auth.slice";
import { useTranslation } from "i18next-vue";
import { reactive } from "vue";
import AccountButton from "./navbar/AccountButton.vue";

const { t } = useTranslation();
const dispatch = useDispatch();
const { currentTheme, isDarkMode } = useTheme();
const [isLoggedIn, user] = useAuth();
const data = reactive({ menuOpen: false });

const htmlEl = document.getElementsByTagName("html")[0];

function onThemeToggle() {
  dispatch(toggleTheme());

  if (currentTheme.value === "dark") {
    htmlEl.classList.add("dark");
  } else {
    htmlEl.classList.remove("dark");
  }
}
</script>

<template>
  <header
    class="z-40 items-center h-16 bg-white shadow-lg dark:bg-gray-700 rounded-2xl"
  >
    <div
      class="relative z-20 flex flex-col justify-center h-full px-3 mx-auto flex-center"
    >
      <div
        class="relative flex items-center w-full pl-1 lg:max-w-68 sm:pr-2 sm:ml-0"
      >
        <div class="container relative left-0 z-50 flex w-3/4 h-auto h-full">
          <router-link to="/" class="nav-button mr-2">
            <home />
          </router-link>

          <div class="relative flex items-center w-full h-full lg:w-64 group">
            <search
              class="absolute left-0 z-20 hidden w-4 h-4 ml-4 text-gray-500 pointer-events-none text-current group-hover:text-gray-400 sm:block"
            />
            <input
              type="text"
              class="block h-10 w-full py-1.5 pl-10 pr-4 leading-normal rounded-2xl focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 ring-opacity-90 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-100"
              :placeholder="t('components.navbar.search')"
            />
          </div>
        </div>

        <div
          class="relative flex items-center justify-end w-1/4 p-1 ml-5 mr-4 sm:mr-0 sm:right-auto gap-x-2"
        >
          <button
            :title="t('components.navbar.toggleTheme')"
            class="nav-button"
            @click="onThemeToggle"
          >
            <sun v-if="isDarkMode" />
            <moon v-else />
          </button>

          <account-button v-if="isLoggedIn" :user="user" />

          <router-link to="/login" class="relative block nav-button" v-else>
            <log-in />
          </router-link>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="postcss">
.nav-button {
  @apply p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md;
}
</style>
