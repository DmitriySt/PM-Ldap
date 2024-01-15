import { RootState } from "store/store";

export const selectPasswordGroup = (state: RootState) =>
  state.passwordGroupReducer;
