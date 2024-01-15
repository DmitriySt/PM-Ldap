import { IUserInfoResponse } from "./user-types";
import { api } from "modules/api";
import { USER_INFO_URL } from "./user-constants";

export const getUserInfo = async (): Promise<IUserInfoResponse> => {
  const {
    data: { displayName },
  } = await api.get<IUserInfoResponse>(USER_INFO_URL);
  return { displayName };
};
