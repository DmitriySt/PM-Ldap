import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderWithProviders } from "helpers/test-helper";
import { PasswordList } from "modules/password/components/password-list/password-list";
import {
  groupTreeData,
  passwordEmptyStub,
  passwordListStub,
} from "modules/password/tests/password-group.stub";
import { setupStore } from "store/store";

describe("password-list", () => {
  it("renders empty correctly", async () => {
    const store = setupStore({
      passwordGroupReducer: {
        groupTreeOpen: false,
        groupTree: {
          isLoading: false,
          data: groupTreeData,
        },
        passwordGroup: {
          key: 0,
          title: "",
          parentId: 0,
        },
      },
    });

    const view = renderWithProviders(
      <PasswordList
        currentRow={passwordEmptyStub}
        onChange={() => null}
        onNewRecord={() => null}
        passwordList={[]}
      />,
      { store },
    );

    expect(view).toMatchSnapshot();

    const addButton = screen.getByRole("button", {
      name: /добавить запись/i,
    });

    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeDisabled();
  });

  it("list functional", async () => {
    const store = setupStore({
      passwordGroupReducer: {
        groupTreeOpen: false,
        groupTree: {
          isLoading: false,
          data: groupTreeData,
        },
        passwordGroup: groupTreeData[0],
      },
    });

    const onChange = jest.fn(() => true);
    const onNewRecord = jest.fn();

    const view = renderWithProviders(
      <PasswordList
        currentRow={passwordEmptyStub}
        onChange={onChange}
        onNewRecord={onNewRecord}
        passwordList={passwordListStub}
      />,
      { store },
    );

    const addButton = screen.getByRole("button", {
      name: /добавить запись/i,
    });

    expect(addButton).toBeInTheDocument();
    expect(addButton).toBeEnabled();

    expect(view).toMatchSnapshot();

    await userEvent.click(addButton);
    expect(onNewRecord).toHaveBeenCalledTimes(1);

    expect(
      await screen.findByText(passwordListStub[0].name),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(passwordListStub[0].login),
    ).toBeInTheDocument();

    const searchInput = await screen.findByPlaceholderText(/поиск/i);
    await userEvent.type(searchInput, "name3");
    await waitFor(() => {
      expect(
        screen.queryByText(passwordListStub[0].login),
      ).not.toBeInTheDocument();
    });

    await userEvent.click(screen.getByText(passwordListStub[2].login));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(passwordListStub[2]);
  });
});
