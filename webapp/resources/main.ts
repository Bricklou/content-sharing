import { createApp } from "vue";
import App from "./App.vue";
import "./style.pcss";
import { router } from "./router";
import store, { createRedux } from "./store";
import I18NextVue from "i18next-vue";
import { setupI18n } from "./i18n";

setupI18n().then((i18next) => {
  createApp(App)
    .use(router)
    .use(createRedux(store))
    .use(I18NextVue, { i18next })
    .mount("#app");
});
