import { EnhancedStore } from "@reduxjs/toolkit";
import { App, Plugin, reactive } from "vue";
import { RootState } from "./init";

export const storeKey = Symbol("Redux-Store");

export const createRedux = (store: EnhancedStore) => {
  const rootStore = reactive<{ state: RootState }>({
    state: store.getState(),
  });

  const plugin: Plugin = {
    install: (app: App) => {
      app.provide<{ state: RootState }>(storeKey, rootStore);

      store.subscribe(() => {
        rootStore.state = store.getState();
      });
    },
  };

  return plugin;
};
