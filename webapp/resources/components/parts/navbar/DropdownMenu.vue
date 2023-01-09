<script lang="ts" setup>
import { logout } from "@/store/reducer/auth.slice";
import { useRouter } from "vue-router";
import { useDispatch } from "@/store";
import { LayoutDashboard, LogOut, UserCog } from "lucide-vue-next";
import { useTranslation } from "i18next-vue";
import { User } from "@/types/user";
import type { DropdownItemType } from "@/components/parts/navbar/DropdownItem.vue";
import DropdownItem from "@/components/parts/navbar/DropdownItem.vue";

const props = defineProps<{ isOpen: boolean; user: User }>();
const emits = defineEmits(["close"]);
const router = useRouter();
const dispatch = useDispatch();
const { t } = useTranslation();

const items: DropdownItemType[] = [
  {
    title: t("components.navbar.my_account"),
    to: "my-account",
    icon: UserCog,
  },
  {
    title: t("components.navbar.admin-redirect"),
    to: "/admin/",
    external: true,
    condition: () => props.user.is_staff || props.user.is_superuser,
    icon: LayoutDashboard,
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
        v-for="(item, index) in items.filter((i) =>
          i.condition ? i.condition() : true
        )"
        :key="index"
        @click.passive="emits('close')"
      >
        <dropdown-item :key="index" :item="item" />
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
