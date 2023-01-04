import { configureStore } from "@reduxjs/toolkit";
import { reducer } from "./reducer";
import logger from "redux-logger";

const store = configureStore({
  reducer,
  devTools: process.env.NODE_ENV === "development",
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
