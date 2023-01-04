import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes";
import store from "../store";

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authState = store.getState().auth;

  // if any of the router has a meta named 'requiresAuth: true'
  // then check if the user is logged in before routing to this path:
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authState.user) {
      next({ name: "login" });
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.requiresLogged)) {
    // else if any of the routes has a meta named 'requiresLogged: true'
    // then check if the user is logged in; if true continue to home page else continue
    // routing to the destination path
    // this comes to play if the user is logged in and tries to access the login/register page
    if (authState.user) {
      next({ name: "home" });
    } else {
      next();
    }
  } else {
    next();
  }
});
