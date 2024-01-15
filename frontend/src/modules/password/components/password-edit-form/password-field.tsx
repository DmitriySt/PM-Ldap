import { Button, Input, Popover } from "antd";
import styles from "./password-field.module.scss";
import { PasswordGenerator } from "modules/password/components/password-generator/password-generator";
import { FC, useState } from "react";

interface IPasswordFieldProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const PasswordField: FC<IPasswordFieldProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);

  const setPassword = (password: string) => {
    if (onChange) {
      onChange(password);
      if (open) {
        setOpen(false);
      }
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handlerOnChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  return (
    <div className={styles.passwordField}>
      <Input.Password
        className={styles.passwordInput}
        id="password"
        value={value}
        name="password"
        onChange={handlerOnChange}
      />

      <Popover
        content={<PasswordGenerator onSelection={setPassword} />}
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Button type="primary">Сгенерировать</Button>
      </Popover>
    </div>
  );
};
