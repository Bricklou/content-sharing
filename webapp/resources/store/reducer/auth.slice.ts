import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HttpAPI } from "@/api";
import Axios from "axios";
import { User } from "@/types/user";
import { useSelector } from "@/store";
import { ComputedRef } from "vue";

const SLICE_NAME = "auth";

export interface AuthState {
  user?: User;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: undefined,
  isLoggedIn: false,
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
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(refreshUser.pending, (state) => {
      state.user = undefined;
      state.isLoggedIn = false;
    });
    builder.addCase(refreshUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    });
    builder.addCase(refreshUser.rejected, (state) => {
      state.user = undefined;
      state.isLoggedIn = false;
    });

    builder.addCase(login.pending, (state) => {
      state.user = undefined;
      state.isLoggedIn = false;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;
    });
    builder.addCase(login.rejected, (state) => {
      state.user = undefined;
      state.isLoggedIn = false;
    });
  },
});

export const { logout } = authSlice.actions;

export const userSelector = (state: AuthState): User | undefined => state.user;
export const useAuth: () => [
  ComputedRef<boolean>,
  ComputedRef<User | undefined>
] = () => [
  useSelector((state) => state.auth.user !== undefined),
  useSelector((state) => state.auth.user),
];

export default authSlice.reducer;
