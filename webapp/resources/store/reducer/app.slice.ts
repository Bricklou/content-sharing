import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const SLICE_NAME = "auth";

export interface AuthState {
  isLoaded: boolean;
}

const initialState: AuthState = {
  isLoaded: false,
};

export const appSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    setLoaded: (state, action: PayloadAction<boolean>) => {
      state.isLoaded = action.payload;
    },
  },
});

export const { setLoaded } = appSlice.actions;

export default appSlice.reducer;
