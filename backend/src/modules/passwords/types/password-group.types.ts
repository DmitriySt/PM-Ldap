export interface IPasswordGroupTree {
  key: number;
  title: string;
  parentId: number;
  children?: IPasswordGroupTree[];
}

export interface IPasswordGroupDefault {
  title: string;
}

export interface IPasswordGroup {
  id: number;
  name: string;
  parentId: number | null;
  level: number;
}
