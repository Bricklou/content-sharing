import authReducer from "./auth.slice";
import appReducer from "./app.slice";
import themeReducer from "./theme.slice";

export const reducer = {
  auth: authReducer,
  theme: themeReducer,
  app: appReducer,
};
