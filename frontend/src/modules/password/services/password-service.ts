import { api } from "modules/api";
import {
  PASSWORD_ADD_URL,
  PASSWORD_DELETE_URL,
  PASSWORD_EDIT_URL,
  PASSWORD_LIST_URL,
} from "modules/password/constants/password-constants";
import {
  CharacterSetType,
  IGeneratePasswordSets,
  IPassword,
} from "modules/password/types/password-types";

export const getPaswwordList = async (
  passwordGroup: number,
): Promise<IPassword[]> => {
  const { data } = await api.post<IPassword[]>(PASSWORD_LIST_URL, {
    groupId: passwordGroup,
  });
  return data;
};

export const editPassword = async (password: IPassword): Promise<boolean> => {
  const res = await api.post<boolean>(PASSWORD_EDIT_URL, password);
  return res.data;
};

export const addPassword = async (password: IPassword): Promise<boolean> => {
  const res = await api.post<boolean>(PASSWORD_ADD_URL, password);
  return res.data;
};

export const deletePassword = async (passwordId: number): Promise<boolean> => {
  const res = await api.post<boolean>(PASSWORD_DELETE_URL, { passwordId });
  return res.data;
};

const passwordSets: IGeneratePasswordSets = {
  lowerCase: Array.from("abcdefghijklmnopqrstuvwxyz"),
  upperCase: Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ"),
  numbers: Array.from("0123456789"),
  symbols: Array.from("!@#$%^&*()_+"),
};

export const generatePassword = (
  sets: CharacterSetType[],
  length: number,
): string => {
  const setsArray: string[] = [];
  const pass: string[] = Array(length);
  for (let i = 0; i < sets.length; i++) {
    let stop = false;
    while (!stop) {
      let setsIndex = Math.floor(Math.random() * passwordSets[sets[i]].length);
      let passIndex = Math.floor(Math.random() * length);
      if (pass[passIndex] === undefined) {
        pass[passIndex] = passwordSets[sets[i]][setsIndex];
        setsArray.push(...passwordSets[sets[i]]);
        stop = true;
      }
    }
  }

  for (let i = 0; i < pass.length; i++) {
    if (pass[i] === undefined) {
      pass[i] = setsArray[Math.floor(Math.random() * setsArray.length)];
    }
  }

  return pass.join("");
};
