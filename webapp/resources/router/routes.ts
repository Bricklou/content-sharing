import type { RouteRecordRaw } from "vue-router";
import HelloWorld from "../components/HelloWorld.vue";
import LoginPage from "../pages/LoginPage.vue";
import MyAccount from "@/pages/MyAccount.vue";

declare module "vue-router" {
  interface RouteMeta {
    requiresLogged?: boolean;
    requiresAuth?: boolean;
  }
}

export const routes: RouteRecordRaw[] = [
  { path: "/", component: HelloWorld, name: "home" },
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
  },
];
