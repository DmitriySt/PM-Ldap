import { userEvent } from "@testing-library/user-event";
import { renderWithProviders } from "helpers/test-helper";
import { screen, within } from "@testing-library/react";
import PasswordGroupTree from "modules/password/components/password-group-tree/password-group-tree";
import { PASSWORD_GROUP_TREE_URL } from "modules/password/constants/password-group-constants";
import { groupTreeData } from "modules/password/tests/password-group.stub";
import axios, { AxiosError, AxiosResponse } from "axios";

const passwordGroupService = require("modules/password/services/password-group-service");
const mockedAxios = axios as jest.Mocked<typeof axios>;

afterEach(() => {
  jest.restoreAllMocks();
});

const axiosSuccess = (url: string) => {
  if (url === PASSWORD_GROUP_TREE_URL) {
    return Promise.resolve({ data: groupTreeData } as AxiosResponse);
  }
  return Promise.reject<AxiosError>(new AxiosError("Error message", "400"));
};

describe("password-group-tree-render", () => {
  it("renders correctly", async () => {
    mockedAxios.get.mockImplementation(axiosSuccess);
    const getPasswordGroupTree = jest.spyOn(
      passwordGroupService,
      "getPasswordGroupTree",
    );
    const view = renderWithProviders(<PasswordGroupTree />);

    const addButton = screen.getByRole("button", {
      name: /добавить группу/i,
    });
    const editButton = screen.getByRole("button", {
      name: /редактировать группу/i,
    });

    const delButton = screen.getByRole("button", {
      name: /удалить группу/i,
    });

    expect(getPasswordGroupTree).toBeCalledTimes(1);

    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled();

    expect(editButton).toBeInTheDocument();
    expect(editButton).toBeDisabled();

    expect(delButton).toBeInTheDocument();
    expect(delButton).toBeDisabled();

    expect(await screen.findByText(groupTreeData[1].title)).toBeInTheDocument();
    expect(view).toMatchSnapshot();
  });

  it("buttons group", async () => {
    mockedAxios.get.mockImplementation(axiosSuccess);

    await renderWithProviders(<PasswordGroupTree />);

    const addButton = screen.getByRole("button", {
      name: /добавить группу/i,
    });
    const editButton = screen.getByRole("button", {
      name: /редактировать группу/i,
    });

    const delButton = screen.getByRole("button", {
      name: /удалить группу/i,
    });

    let treeNode = await screen.findByText(groupTreeData[0].title);

    expect(treeNode).toBeInTheDocument();

    await userEvent.click(treeNode);

    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeEnabled();

    expect(editButton).toBeInTheDocument();
    expect(editButton).toBeDisabled();

    expect(delButton).toBeInTheDocument();
    expect(delButton).toBeDisabled();

    treeNode = await screen.findByText(groupTreeData[1].title);
    expect(treeNode).toBeInTheDocument();

    await userEvent.click(treeNode);

    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeEnabled();

    expect(editButton).toBeInTheDocument();
    expect(editButton).toBeEnabled();

    expect(delButton).toBeInTheDocument();
    expect(delButton).toBeEnabled();
  });

  it("add form", async () => {
    mockedAxios.get.mockImplementation(axiosSuccess);
    const view = renderWithProviders(<PasswordGroupTree />);
    const addButton = screen.getByRole("button", {
      name: /добавить группу/i,
    });

    const treeNode = await screen.findByText(groupTreeData[0].title);
    expect(treeNode).toBeInTheDocument();
    await userEvent.click(treeNode);

    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeEnabled();

    await userEvent.click(addButton);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    within(dialog).getByRole("heading", {
      name: /Добавить группу/i,
    });
    expect(view).toMatchSnapshot();
  });

  it("edit form", async () => {
    mockedAxios.get.mockImplementation(axiosSuccess);
    const view = renderWithProviders(<PasswordGroupTree />);

    const treeNode = await screen.findByText(groupTreeData[1].title);
    expect(treeNode).toBeInTheDocument();
    await userEvent.click(treeNode);

    const editButton = screen.getByRole("button", {
      name: /редактировать группу/i,
    });

    expect(editButton).toBeInTheDocument();
    expect(editButton).toBeEnabled();

    await userEvent.click(editButton);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();

    within(dialog).getByRole("heading", {
      name: new RegExp(`Редактировать "${groupTreeData[1].title}"`, "i"),
    });
    expect(view).toMatchSnapshot();
  });
});
