import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "../helpers";
import { computed } from "vue";

const SLICE_NAME = "theme";
const THEME_KEY = "theme";

type ThemeType = "dark" | "light";

export interface ThemeState {
  currentTheme: ThemeType;
}

const initialState: ThemeState = {
  currentTheme:
    (localStorage.getItem(THEME_KEY) as ThemeType | null) || "light",
};

export const authSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    useDark(state) {
      localStorage.setItem(THEME_KEY, "dark");
      state.currentTheme = "dark";
    },
    useLight(state) {
      localStorage.setItem(THEME_KEY, "light");
      state.currentTheme = "light";
    },
    toggleTheme(state) {
      state.currentTheme = state.currentTheme === "light" ? "dark" : "light";
      localStorage.setItem(THEME_KEY, state.currentTheme);
    },
  },
});

export const { useDark, useLight, toggleTheme } = authSlice.actions;

export const useTheme = () => ({
  useDark,
  isDarkMode: computed(
    () => useSelector((state) => state.theme.currentTheme).value === "dark"
  ),
  useLight,
  toggleTheme,
  currentTheme: useSelector((state) => state.theme.currentTheme),
});

export default authSlice.reducer;
