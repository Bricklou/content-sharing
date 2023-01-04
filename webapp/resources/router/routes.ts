import { RouteRecordRaw } from "vue-router";
import HelloWorld from "../components/HelloWorld.vue";
import LoginPage from "../pages/LoginPage.vue";

export const routes: RouteRecordRaw[] = [
  { path: "/", component: HelloWorld },
  {
    path: "/login",
    meta: {
      requiresLogged: true,
    },
    component: LoginPage,
  },
];
