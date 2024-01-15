import { render, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { PasswordView } from "modules/password/components/password-view/password-view";
import { screen } from "@testing-library/react";
import { passwordStub } from "modules/password/tests/password-group.stub";

afterEach(() => {
  jest.restoreAllMocks();
});

const onEditHandler = jest.fn();
const onDeleteHandler = jest.fn();

describe("password-view", () => {
  it("renders correctly", async () => {
    const view = render(
      <PasswordView
        password={passwordStub}
        onEdit={onEditHandler}
        onDelete={onDeleteHandler}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(passwordStub.login)).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue(passwordStub.password)).toBeInTheDocument();
    expect(screen.getByText(passwordStub.url)).toBeInTheDocument();
    expect(screen.getByText(passwordStub.description)).toBeInTheDocument();
    expect(view).toMatchSnapshot();

    // eslint-disable-next-line testing-library/no-node-access
    const dropDownMenu = document.querySelector("div.ant-dropdown-trigger");
    expect(dropDownMenu).not.toBeNull();

    await userEvent.hover(dropDownMenu as Element);
    await waitFor(() => {
      expect(screen.getByText("Редактировать")).toBeInTheDocument();
    });
    await userEvent.click(screen.getByText("Редактировать"));
    expect(onEditHandler).toHaveBeenCalledTimes(1);

    await userEvent.hover(dropDownMenu as Element);
    await waitFor(() => {
      expect(dropDownMenu).toHaveClass("ant-dropdown-open");
    });

    await userEvent.click(screen.getByText("Удалить"));
    expect(onDeleteHandler).toHaveBeenCalledTimes(1);
  });
});
