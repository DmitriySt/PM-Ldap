import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppError } from "helpers/app-error";
import { PASSWORD_STORE_KEY } from "modules/password/constants/password-constants";
import { getPasswordGroupTree } from "modules/password/services/password-group-service";

export const getPasswordGroupTreeAction = createAsyncThunk(
  `${PASSWORD_STORE_KEY} /get-group-tree`,
  async (payload, thunkAPI) => {
    try {
      return getPasswordGroupTree();
    } catch (e) {
      return thunkAPI.rejectWithValue(AppError(e));
    }
  }
);
