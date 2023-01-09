import type { RouteRecordRaw } from "vue-router";
import HelloWorld from "@/components/HelloWorld.vue";
import LoginPage from "@/pages/LoginPage.vue";
import MyAccount from "@/pages/MyAccount.vue";
import FilesLayout from "@/pages/files/FilesLayout.vue";

declare module "vue-router" {
  interface RouteMeta {
    requiresLogged?: boolean;
    requiresAuth?: boolean;
  }
}

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/me",
  },
  {
    path: "/login",
    name: "login",
    meta: {
      requiresLogged: true,
    },
    component: LoginPage,
  },

  {
    path: "/my-account",
    name: "my-account",
    meta: {
      requiresAuth: true,
    },
    component: MyAccount,
    children: [
      {
        path: "",
        component: HelloWorld,
      },
      {
        path: "/security",
        component: HelloWorld,
      },
    ],
  },
  { path: "/me/:files*", component: FilesLayout, name: "files" },
  { path: "/:any*", redirect: "/" },
];
