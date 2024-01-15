export interface IPasswordGroupState {
  groupTreeOpen: boolean;
  groupTree: {
    isLoading: boolean;
    data: IPasswordGroupTree[];
  };
  passwordGroup: IPasswordGroup;
}

export interface IPasswordGroup {
  key: number;
  title: string;
  parentId: number;
}

export interface IPasswordGroupTree extends IPasswordGroup {
  children?: IPasswordGroupTree[];
}
