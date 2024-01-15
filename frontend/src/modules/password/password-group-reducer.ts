import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IError } from "helpers/app-error";
import { PASSWORD_GROUP_STORE_KEY } from "modules/password/constants/password-group-constants";
import { getPasswordGroupTreeAction } from "modules/password/password-group-actions";
import {
  IPasswordGroup,
  IPasswordGroupTree,
  IPasswordGroupState,
} from "modules/password/types/password-group-types";

const initialState: IPasswordGroupState = {
  groupTreeOpen: false,
  groupTree: {
    isLoading: false,
    data: [],
  },
  passwordGroup: {
    key: 0,
    title: "",
    parentId: 0,
  },
};

export const passwordGroupSlice = createSlice({
  name: PASSWORD_GROUP_STORE_KEY,
  initialState,
  reducers: {
    setPasswordGroup(state, action: PayloadAction<IPasswordGroup>) {
      state.passwordGroup = action.payload;
    },
    setGroupTreeOpen(state, action: PayloadAction<boolean>) {
      state.groupTreeOpen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPasswordGroupTreeAction.pending.type, (state) => {
        state.groupTree.isLoading = true;
      })
      .addCase(
        getPasswordGroupTreeAction.rejected.type,
        (state, action: PayloadAction<IError>) => {
          state.groupTree.isLoading = false;
        },
      )
      .addCase(
        getPasswordGroupTreeAction.fulfilled.type,
        (state, action: PayloadAction<IPasswordGroupTree[]>) => {
          state.groupTree.isLoading = false;
          state.groupTree.data = action.payload;
        },
      );
  },
});

export const passwordGroupReducer = passwordGroupSlice.reducer;
export const passwordGroupActions = passwordGroupSlice.actions;
