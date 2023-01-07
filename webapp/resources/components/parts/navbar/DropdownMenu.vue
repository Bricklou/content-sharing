<script lang="ts" setup>
import { logout } from "@/store/reducer/auth.slice";
import { useRouter } from "vue-router";
import { useDispatch } from "@/store";
import { LogOut, UserCog } from "lucide-vue-next";
import { FunctionalComponent } from "vue";
import { useTranslation } from "i18next-vue";

const props = defineProps<{ isOpen: boolean }>();
const emits = defineEmits(["close"]);
const router = useRouter();
const dispatch = useDispatch();
const { t } = useTranslation();

type DropdownItem = {
  title: string;
  icon?: FunctionalComponent;
  description?: string;
} & AllXOR<[{ action: () => void }, { to: string }]>;

const items: DropdownItem[] = [
  {
    title: t("components.navbar.my_account"),
    to: "my-account",
    icon: UserCog,
  },
  {
    title: t("components.navbar.logout"),
    action: async () => {
      await dispatch(logout());
      await router.replace("/");
    },
    icon: LogOut,
  },
];
</script>

<template>
  <transition name="fade" appear>
    <div
      class="absolute right-0 top-14 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg dark:bg-gray-700 ring-1 ring-black ring-opacity-5 transition-all duration-75 ease-in-out"
      v-if="props.isOpen"
    >
      <div
        class="py-1 flex flex-col"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
        v-for="(item, index) in items"
        :key="index"
        @click.passive="emits('close')"
      >
        <button
          type="button"
          class="flex items-center mx-2 px-2 py-2 rounded text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 text-left"
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

        <router-link
          class="flex items-center mx-2 px-2 py-2 rounded text-md text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-100 dark:hover:text-white dark:hover:bg-gray-600 text-left"
          role="menuitem"
          :to="item.to"
          v-else
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
        </router-link>
      </div>
    </div>
  </transition>
</template>

<style scoped lang="postcss">
.fade-enter-active {
  @apply opacity-0;
}
.fade-enter,
.fade-leave-to {
  @apply opacity-0;
}
</style>
