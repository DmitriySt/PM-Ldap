import { IAuthState, IUserInfo } from "./auth-types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AUTH_STORE_KEY } from "modules/auth/auth-constants";
import { IError } from "helpers/app-error";
import {
  loginAction,
  logoutAction,
  refreshAction,
} from "modules/auth/auth-actions";

const initialState: IAuthState = {
  isAuth: false,
  error: "",
  isLoading: true,
  userInfo: {
    id: 0,
    roles: [],
    displayName: "",
  },
};

export const authSlice = createSlice({
  name: AUTH_STORE_KEY,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginAction.pending.type, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(
        loginAction.fulfilled.type,
        (state, action: PayloadAction<IUserInfo>) => {
          state.isLoading = false;
          state.isAuth = !!action.payload?.id;
          state.userInfo = action.payload;
          state.error = "";
        }
      )
      .addCase(
        loginAction.rejected.type,
        (state, action: PayloadAction<IError>) => {
          state.isLoading = false;
          state.isAuth = false;
          state.userInfo = initialState.userInfo;
          state.error = action.payload.message;
        }
      )
      .addCase(logoutAction.fulfilled.type, (state) => {
        state.isLoading = false;
        state.isAuth = false;
        state.userInfo = initialState.userInfo;
        state.error = "";
      })
      .addCase(refreshAction.pending.type, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(
        refreshAction.fulfilled.type,
        (state, action: PayloadAction<IUserInfo>) => {
          state.isLoading = false;
          state.isAuth = !!action.payload?.id;
          state.userInfo = action.payload;
          state.error = "";
        }
      )
      .addCase(
        refreshAction.rejected.type,
        (state, action: PayloadAction<IError>) => {
          state.isLoading = false;
          state.isAuth = false;
          state.userInfo = initialState.userInfo;
          state.error =
            action.payload.code !== 401 ? action.payload.message : "";
        }
      );
  },
});

export const authReducer = authSlice.reducer;
