<script setup lang="ts">
import { useAuth } from "@/store/reducer/auth.slice";
import UserAvatar from "@/components/UserAvatar.vue";
import { User } from "@/types/user";
import { reactive } from "vue";
import { useTranslation } from "i18next-vue";

const [, user] = useAuth();
const { t } = useTranslation();

let userForm: User = reactive(user.value as User);
</script>

<template>
  <section
    class="flex flex-col md:flex-row flex-1 items-center space-y-8 md:space-y-0 md:space-x-8 m-8 md:mx-auto md:max-w-screen-lg"
  >
    <aside
      class="relative self-stretch rounded-lg w-full lg:w-64 px-4 py-2 bg-white dark:bg-gray-700"
    >
      <nav class="min-h-full">
        <router-link to="/my-account" class="sidebar-links">
          Base informations
        </router-link>
        <router-link to="/my-account/security" class="sidebar-links">
          Security
        </router-link>
      </nav>
    </aside>

    <form
      class="flex-1 w-full my-8 lg:mx-auto shadow-md flex flex-col relative self-stretch"
    >
      <div class="p-4 rounded-t-lg bg-indigo-400 dark:bg-blue-900">
        <div class="max-w-sm mx-auto md:w-full md:mx-8">
          <div class="inline-flex items-center space-x-4">
            <user-avatar
              :user="user"
              size="w-14 w-14"
              class="rounded-full ring-2 ring-purple-500"
            />
            <h1
              class="text-gray-900 dark:text-white text-2xl"
              v-text="user.username"
            ></h1>
          </div>
        </div>
      </div>

      <div
        class="flex-1 flex flex-col lg:flex-row bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-b-lg"
      >
        <router-view />
      </div>

      <!--      <div
        class="flex flex-col space-y-4 py-4 bg-indigo-50 dark:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-b-lg"
      >
        <div class="items-center w-full px-4 py-2">
          <h2 class="uppercase text-sm text-gray-500 dark:text-gray-300">
            Base informations
          </h2>

          <div class="items-center py-2 w-full md:inline-flex">
            <h2 class="max-w-sm mx-auto md:w-1/3">
              {{ t("pages.my-account.email") }}
            </h2>
            <div class="max-w-sm mx-auto md:w-2/3">
              <div class="relative">
                <input
                  type="email"
                  id="user-info-email"
                  class="input"
                  :placeholder="t('pages.my-account.email')"
                  v-model="userForm.email"
                />
              </div>
            </div>
          </div>

          <div class="items-center py-2 w-full md:inline-flex">
            <h2 class="max-w-sm mx-auto md:w-1/3">
              {{ t("pages.my-account.username") }}
            </h2>
            <div class="max-w-sm mx-auto md:w-2/3">
              <div class="relative">
                <input
                  type="text"
                  id="user-info-email"
                  class="input"
                  :placeholder="t('pages.my-account.email')"
                  v-model="userForm.username"
                />
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div
          class="items-center w-full p-4 space-y-4 md:inline-flex md:space-y-0"
        >
          <h2 class="max-w-sm mx-auto md:w-1/3">Personal info</h2>
          <div class="max-w-sm mx-auto space-y-5 md:w-2/3">
            <div>
              <div class="relative">
                <input
                  type="text"
                  id="user-info-name"
                  class="input"
                  placeholder="Username"
                  v-model="userForm.username"
                />
              </div>
            </div>
            <div>
              <div class="relative">
                <input
                  type="text"
                  id="user-info-phone"
                  class="input"
                  placeholder="Phone number"
                />
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div
          class="items-center w-full p-8 space-y-4 md:inline-flex md:space-y-0"
        >
          <h2 class="max-w-sm mx-auto md:w-4/12">Change password</h2>
          <div
            class="w-full max-w-sm pl-2 mx-auto space-y-5 md:w-5/12 md:pl-9 md:inline-flex"
          >
            <div class="relative">
              <input
                type="text"
                id="user-info-password"
                class="input"
                placeholder="Password"
              />
            </div>
          </div>
          <div class="text-center md:w-3/12 md:pl-6">
            <button
              type="button"
              class="py-2 px-4 bg-pink-600 hover:bg-pink-700 focus:ring-pink-500 focus:ring-offset-pink-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            >
              Change
            </button>
          </div>
        </div>
        <hr />
        <div class="w-full px-4 pb-4 ml-auto text-gray-500 md:w-1/3">
          <cs-button
            type="submit"
            colors="bg-indigo-400 hover:bg-indigo-300 dark:bg-indigo-600 hover:dark:bg-indigo-500 text-white"
          >
            <save class="text-current w-4 h-4 inline mr-2" />
            Save
          </cs-button>
        </div>
      </div>-->
    </form>
  </section>
</template>

<style scoped lang="postcss">
hr {
  @apply dark:border-gray-600 mx-6;
}

input.input {
  @apply rounded-2xl border-transparent flex-1 appearance-none border;
  @apply w-full py-2 px-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-white placeholder-gray-400 shadow-sm text-base;
  @apply focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent;
}

.sidebar-links {
  @apply px-4 py-2 my-4 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md;
  @apply transition-colors duration-150 ease-out flex items-center;

  &.router-link-exact-active {
    @apply bg-indigo-400 dark:bg-indigo-600 text-white;
  }
}
</style>
