<script setup lang="ts">
import { useTranslation } from "i18next-vue";
import CsButton from "../components/CsButton.vue";
import { useDispatch } from "../store";
import { login } from "../store/reducer/auth.slice";
import { reactive } from "vue";
import { Lock, LogIn, Mail } from "lucide-vue-next";
import { useRouter } from "vue-router";

const { t } = useTranslation();
const router = useRouter();
const dispatch = useDispatch();
const data = reactive({ username: "", password: "" });

async function loginSubmit() {
  try {
    await dispatch(login(data)).unwrap();

    await router.push("/");
  } catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <div class="flex-1 flex items-center">
    <div
      class="flex flex-col w-full mx-auto max-w-md px-4 py-8 bg-white rounded-lg shadow-lg dark:bg-gray-700 sm:px-6 md:px-8 lg:px-10"
    >
      <div
        class="self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl dark:text-white"
      >
        {{ t("pages.login.loginToYourAccount") }}
      </div>
      <div class="mt-8">
        <form action="#" method="post" @submit.prevent="loginSubmit">
          <div class="flex flex-col mb-2">
            <div class="flex relative">
              <span
                class="rounded-l-md inline-flex items-center px-3 border-t bg-white border-l border-b border-gray-300 text-gray-500 shadow-sm text-sm"
              >
                <mail class="text-current w-4 h-4" />
              </span>
              <input
                type="text"
                id="sign-in-email"
                class="rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                :placeholder="t('pages.login.yourEmail')"
                v-model="data.username"
              />
            </div>
          </div>
          <div class="flex flex-col mb-6">
            <div class="flex relative">
              <span
                class="rounded-l-md inline-flex items-center px-3 border-t bg-white border-l border-b border-gray-300 text-gray-500 shadow-sm text-sm"
              >
                <lock class="text-current w-4 h-4" />
              </span>
              <input
                type="password"
                id="sign-in-password"
                name="current-password"
                class="rounded-r-lg flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                :placeholder="t('pages.login.yourPassword')"
                v-model="data.password"
              />
            </div>
          </div>
          <div class="flex items-center mb-6 -mt-4">
            <div class="flex ml-auto">
              <a
                href="#"
                class="inline-flex text-xs font-thin text-gray-500 sm:text-sm dark:text-gray-100 hover:text-purple-700 hover:dark:text-purple-300"
              >
                {{ $t("pages.login.forgotYourPassword") }}
              </a>
            </div>
          </div>
          <div class="flex w-full">
            <cs-button type="submit">
              <log-in class="text-current w-4 h-4 inline mr-2" />
              {{ $t("pages.login.login_btn") }}
            </cs-button>
          </div>
        </form>
      </div>
      <div class="flex items-center justify-center mt-6">
        <a
          href="#"
          target="_blank"
          class="inline-flex items-center text-xs font-thin text-center text-gray-500 hover:text-purple-700 dark:text-gray-100 dark:hover:text-purple-300"
        >
          <span class="ml-2">
            {{ t("pages.login.dontHaveAccount") }}
          </span>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
