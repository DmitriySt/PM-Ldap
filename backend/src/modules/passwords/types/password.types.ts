import { Password } from 'modules/passwords/models/password.model';

export type KeysType<T, V> = {
  [K in keyof T]-?: T[K] extends V ? K : never;
}[keyof T];

export interface IPassword extends Password {
  groupName: string;
}
