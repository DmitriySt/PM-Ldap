export interface IPassword {
  id: number;
  name: string;
  login: string;
  password: string;
  url: string;
  description: string;
  groupId: number;
  groupName: string;
}

export interface IGeneratePasswordSets {
  lowerCase: string[];
  upperCase: string[];
  numbers: string[];
  symbols: string[];
}

export type CharacterSetType = keyof IGeneratePasswordSets;
