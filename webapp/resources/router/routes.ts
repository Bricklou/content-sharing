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
  { path: "/", component: HelloWorld },
  {
    path: "/login",
    meta: {
      requiresLogged: true,
    },
    component: LoginPage,
  },
  {
    path: "/my-account",
    meta: {
      requiresAuth: true,
    },
    component: MyAccount,
  },
];
