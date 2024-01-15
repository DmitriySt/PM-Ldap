import { api } from "modules/api";
import {
  PASSWORD_GROUP_ADD_URL,
  PASSWORD_GROUP_DEL_URL,
  PASSWORD_GROUP_EDIT_URL,
  PASSWORD_GROUP_TREE_URL,
} from "modules/password/constants/password-group-constants";
import {
  IPasswordGroup,
  IPasswordGroupTree,
} from "modules/password/types/password-group-types";

export const getPasswordGroupTree = async (): Promise<IPasswordGroupTree[]> => {
  const { data } = await api.get<IPasswordGroupTree[]>(PASSWORD_GROUP_TREE_URL);
  return data;
};

export const addPasswordGroup = async (
  group: IPasswordGroup,
): Promise<IPasswordGroup> => {
  const { data } = await api.post<IPasswordGroup>(
    PASSWORD_GROUP_ADD_URL,
    group,
  );
  return data;
};

export const editPasswordGroup = async (
  group: IPasswordGroup,
): Promise<IPasswordGroup> => {
  const { data } = await api.post<IPasswordGroup>(
    PASSWORD_GROUP_EDIT_URL,
    group,
  );
  return data;
};

export const deletePasswordGroup = async (
  groupId: number,
): Promise<boolean> => {
  const { data } = await api.post<boolean>(PASSWORD_GROUP_DEL_URL, { groupId });
  return data;
};
