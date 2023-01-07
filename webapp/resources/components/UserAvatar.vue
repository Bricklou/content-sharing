<script lang="ts" setup>
import { User } from "@/types/user";
import { useTranslation } from "i18next-vue";
import { User as UserIcon } from "lucide-vue-next";

const props = defineProps<{ user: User; size?: string }>();
const { t } = useTranslation();
</script>

<template>
  <div class="relative block">
    <img
      v-if="props.user.avatar != null"
      :alt="
        t('components.user_avatar.avatar_alt', {
          username: props.user.username,
        })
      "
      :src="props.user.avatar"
      class="mx-auto object-cover rounded-full"
      :class="props.size || 'h-10 w-10'"
    />
    <UserIcon v-else />
  </div>
</template>

<style scoped></style>
