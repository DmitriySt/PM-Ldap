import { IAuthResponse, ILoginData, IUserInfo } from "./auth-types";
import { api, baseApi } from "../api";
import {
  AUTH_LOGIN_URL,
  AUTH_LOGOUT_URL,
  AUTH_REFRESH_URL,
} from "modules/auth/auth-constants";

export const login = async (loginData: ILoginData): Promise<IUserInfo> => {
  const { data } = await baseApi.post<IAuthResponse>(AUTH_LOGIN_URL, loginData);
  if (data.accessToken) {
    localStorage.setItem("token", data.accessToken);
    return data.userInfo;
  }
  throw new Error("Ошибка механизма авторизации");
};

export const logout = async () => {
  const { data } = await api.get<boolean>(AUTH_LOGOUT_URL);
  localStorage.removeItem("token");
  return data;
};

export const refresh = async (): Promise<IUserInfo> => {
  const { data } = await baseApi.get<IAuthResponse>(AUTH_REFRESH_URL);
  if (data.accessToken) {
    localStorage.setItem("token", data.accessToken);
    return data.userInfo;
  }
  throw new Error("Ошибка механизма авторизации");
};
