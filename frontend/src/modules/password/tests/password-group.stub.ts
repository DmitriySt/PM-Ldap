import { IPassword } from "modules/password/types/password-types";

export const groupTreeData = [
  { key: 1, title: "Мои пароли", parentId: 0 },
  { key: 2, title: "Мои пароли2", parentId: 1 },
  { key: 3, title: "Мои пароли2-1", parentId: 2 },
];

export const passwordEmptyStub: IPassword = {
  id: 0,
  name: "",
  login: "",
  password: "",
  url: "",
  description: "",
  groupId: 0,
  groupName: "",
};

export const passwordStub: IPassword = {
  id: 1,
  name: "name1",
  login: "login1",
  password: "password1",
  url: "url1",
  description: "description1",
  groupId: 1,
  groupName: "Мои пароли",
};

export const passwordListStub: IPassword[] = [
  {
    id: 1,
    name: "name1",
    login: "login1",
    password: "password1",
    url: "url1",
    description: "description1",
    groupId: 1,
    groupName: "Мои пароли",
  },
  {
    id: 2,
    name: "name2",
    login: "login2",
    password: "password2",
    url: "url2",
    description: "description2",
    groupId: 1,
    groupName: "Мои пароли",
  },
  {
    id: 3,
    name: "name3",
    login: "login3",
    password: "password3",
    url: "url3",
    description: "description3",
    groupId: 1,
    groupName: "Мои пароли",
  },
  {
    id: 4,
    name: "name4",
    login: "login4",
    password: "password4",
    url: "url4",
    description: "description4",
    groupId: 1,
    groupName: "Мои пароли",
  },
];
