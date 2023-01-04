import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { computed, ComputedRef } from "vue";
import { useSelector } from "../helpers";
import { HttpAPI } from "../../api";
import Axios from "axios";

const SLICE_NAME = "auth";
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export interface AuthState {
  user?: User;
}

const initialState: AuthState = {
  user: undefined,
};

export const refreshUser = createAsyncThunk<User>(
  `${SLICE_NAME}/refresh`,
  async (data, thunkAPI) => {
    try {
      const response = await HttpAPI.get<{ detail: string; user: User }>(
        "auth"
      );

      if (response.status === 200) {
        return response.data.user;
      } else {
        return thunkAPI.rejectWithValue(response.data);
      }
    } catch (e) {
      if (Axios.isAxiosError(e) && e.response) {
        return thunkAPI.rejectWithValue(e.response.data);
      } else {
        return thunkAPI.rejectWithValue(e);
      }
    }
  }
);

export const login = createAsyncThunk<
  User,
  { username: string; password: string }
>(`${SLICE_NAME}/login`, async (data, thunkAPI) => {
  try {
    const response = await HttpAPI.post<{ detail: string; user: User }>(
      "auth",
      data
    );

    if (response.status === 200) {
      return response.data.user;
    } else {
      return thunkAPI.rejectWithValue(response.data);
    }
  } catch (e) {
    if (Axios.isAxiosError(e) && e.response) {
      return thunkAPI.rejectWithValue(e.response.data);
    } else {
      return thunkAPI.rejectWithValue(e);
    }
  }
});

export const authSlice = createSlice({
  name: SLICE_NAME,
  initialState,
  reducers: {
    logout: (state) => {
      state.user = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(refreshUser.pending, (state) => {
      state.user = undefined;
    });
    builder.addCase(refreshUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(refreshUser.rejected, (state) => {
      state.user = undefined;
    });

    builder.addCase(login.pending, (state) => {
      state.user = undefined;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(login.rejected, (state) => {
      state.user = undefined;
    });
  },
});

export const { logout } = authSlice.actions;

export const userSelector = (state: AuthState): User | undefined => state.user;
export const useAuth: () => [
  ComputedRef<boolean>,
  ComputedRef<User | undefined>
] = () => [
  computed(() => useSelector((state) => state.auth.user).value !== undefined),
  computed(() => useSelector((state) => state.auth.user).value),
];

export default authSlice.reducer;
