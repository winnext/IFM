import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

interface AuthState {
  auth: {
    auth: boolean;
    id: string;
    type: string;
    name: string;
    token: string;
  };
}

// Define the initial state using that type
const initialState: AuthState = {
  auth: {
    auth: false,
    id: "",
    type: "",
    name: "",
    token: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        id: string;
        type: string;
        name: string;
        token: string;
      }>
    ) => {
      state.auth = {
        auth: true,
        ...action.payload,
      };
    },
    logout: (state) => {
      state.auth = initialState.auth;
    },
  },
});

export const { login, logout } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
