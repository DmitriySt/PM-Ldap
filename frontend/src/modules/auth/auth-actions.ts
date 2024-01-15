import { createAsyncThunk } from "@reduxjs/toolkit";
import { AUTH_STORE_KEY } from "modules/auth/auth-constants";
import { ILoginData } from "./auth-types";
import { login, logout, refresh } from "./auth-servivce";
import { AppError } from "helpers/app-error";

export const loginAction = createAsyncThunk(
  `${AUTH_STORE_KEY}/login`,
  async (loginData: ILoginData, thunkAPI) => {
    try {
      return await login(loginData);
    } catch (e) {
      return thunkAPI.rejectWithValue(AppError(e));
    }
  },
);

export const logoutAction = createAsyncThunk(
  `${AUTH_STORE_KEY}/logout`,
  async (payload, thunkAPI) => {
    try {
      return await logout();
    } catch (e) {
      return thunkAPI.rejectWithValue(AppError(e));
    }
  },
);

export const refreshAction = createAsyncThunk(
  `${AUTH_STORE_KEY}/refresh`,
  async (payload, thunkAPI) => {
    try {
      return await refresh();
    } catch (e) {
      return thunkAPI.rejectWithValue(AppError(e));
    }
  },
);
