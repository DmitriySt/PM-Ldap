import { userEvent } from "@testing-library/user-event";
import { renderWithProviders } from "helpers/test-helper";
import { PasswordGroupEditForm } from "modules/password/components/password-group-edit-form/password-group-edit-form";
import {
  PASSWORD_GROUP_ADD_URL,
  PASSWORD_GROUP_EDIT_URL,
} from "modules/password/constants/password-group-constants";
import { groupTreeData } from "modules/password/tests/password-group.stub";
import { setupStore } from "store/store";
import { screen } from "@testing-library/react";
import axios, { AxiosError, AxiosResponse } from "axios";

const mockedAxios = axios as jest.Mocked<typeof axios>;

afterEach(() => {
  jest.restoreAllMocks();
});

const axiosError = (url: string) => {
  if ([PASSWORD_GROUP_ADD_URL, PASSWORD_GROUP_EDIT_URL].includes(url)) {
    return Promise.reject<AxiosError>(
      new AxiosError("Error message", "400", undefined, {}, {
        status: 400,
        data: {
          validationErrors: [
            {
              name: "title",
              errors: ["Поле не может быть пустым"],
            },
            {
              name: "parentId",
              errors: ["Значение задано не верно"],
            },
          ],
        },
      } as AxiosResponse),
    );
  }
  return Promise.reject<AxiosError>(new AxiosError("Error message", "400"));
};

const axiosSuccess = (url: string) => {
  if ([PASSWORD_GROUP_ADD_URL, PASSWORD_GROUP_EDIT_URL].includes(url)) {
    return Promise.resolve({ data: true } as AxiosResponse);
  }
  return Promise.reject<AxiosError>(new AxiosError("Error message", "400"));
};

const onSaveHandler = jest.fn(() => true);
const onCancelHandler = jest.fn(() => true);

describe("password-group-edit-form", () => {
  it("renders add form correctly", async () => {
    const store = setupStore({
      passwordGroupReducer: {
        groupTreeOpen: false,
        groupTree: {
          isLoading: false,
          data: groupTreeData,
        },
        passwordGroup: groupTreeData[1],
      },
    });

    const view = renderWithProviders(
      <PasswordGroupEditForm
        passwordGroup={groupTreeData[1]}
        onCancel={onCancelHandler}
        onSave={onSaveHandler}
        action={"add"}
      />,
      { store },
    );

    expect(view).toMatchSnapshot();
    expect(await screen.findByText("Добавить группу")).toBeInTheDocument();
    expect(await screen.findByText(groupTreeData[1].title)).toBeInTheDocument();
    const titleInput = screen.getByLabelText(/наименование/i);
    expect(titleInput).toHaveValue("");

    mockedAxios.post.mockImplementation(axiosError);
    const saveButton = screen.getByRole("button", {
      name: /сохранить/i,
    });
    await userEvent.click(saveButton);
    expect(
      await screen.findByText("Значение задано не верно"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Поле не может быть пустым"),
    ).toBeInTheDocument();
    expect(onSaveHandler).not.toHaveBeenCalled();
    expect(view).toMatchSnapshot();

    mockedAxios.post.mockImplementation(axiosSuccess);
    await userEvent.type(titleInput, "test");
    expect(titleInput).toHaveValue("test");
    await userEvent.click(saveButton);
    expect(onSaveHandler).toHaveBeenCalledTimes(1);

    expect(view).toMatchSnapshot();

    const cancelButton = screen.getByRole("button", {
      name: /отмена/i,
    });
    await userEvent.click(cancelButton);
    expect(onCancelHandler).toHaveBeenCalledTimes(1);
  });

  it("renders edit form correctly", async () => {
    const store = setupStore({
      passwordGroupReducer: {
        groupTreeOpen: false,
        groupTree: {
          isLoading: false,
          data: groupTreeData,
        },
        passwordGroup: groupTreeData[2],
      },
    });
    const view = renderWithProviders(
      <PasswordGroupEditForm
        passwordGroup={groupTreeData[2]}
        onCancel={() => true}
        onSave={() => true}
        action={"edit"}
      />,
      { store },
    );

    expect(
      await screen.findByText(`Редактировать "${groupTreeData[2].title}"`),
    ).toBeInTheDocument();
    expect(await screen.findByText(groupTreeData[1].title)).toBeInTheDocument();
    expect(screen.getByLabelText(/наименование/i)).toHaveValue(
      groupTreeData[2].title,
    );
    expect(view).toMatchSnapshot();
  });
});
