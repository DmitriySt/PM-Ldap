import { faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Checkbox, Col, InputNumber, Row } from "antd";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import { generatePassword } from "modules/password/services/password-service";
import { CharacterSetType } from "modules/password/types/password-types";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import styles from "./password-generator.module.scss";

export interface IPasswordGeneratorProps {
  onSelection: (password: string) => void;
}

export const PasswordGenerator: FC<IPasswordGeneratorProps> = ({
  onSelection,
}) => {
  const [password, setPassword] = useState<string>("");
  const [characterSet, setCharacterSet] = useState<CharacterSetType[]>([]);
  const [passwordLength, setPasswordLength] = useState<number>(10);
  const buttonDisabled = useMemo(() => password === "", [password]);

  const refreshPassword = useCallback(async () => {
    setPassword(generatePassword(characterSet, passwordLength));
  }, [characterSet, passwordLength]);

  const handleCharacterSetChange = async (
    checkedValues: CheckboxValueType[],
  ) => {
    const sets = checkedValues.map((item) => item as CharacterSetType);
    setCharacterSet(sets);
    if (passwordLength < sets.length) {
      setPasswordLength(sets.length);
    }
  };

  const handlePasswordLengthChange = (e: number | null) => {
    const value = Number(e);
    if (
      !isNaN(value) &&
      value > 0 &&
      value <= 100 &&
      value >= characterSet.length
    ) {
      setPasswordLength(value);
    }
  };

  useEffect(() => {
    refreshPassword();
  }, [refreshPassword]);

  return (
    <>
      <Checkbox.Group
        style={{ width: "100%" }}
        onChange={handleCharacterSetChange}
      >
        <Row>
          <Col span={12}>
            <Checkbox value="lowerCase">abc</Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value="upperCase">ABC</Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value="numbers">123</Checkbox>
          </Col>
          <Col span={12}>
            <Checkbox value="symbols">!@#</Checkbox>
          </Col>
        </Row>
      </Checkbox.Group>
      <div className={styles.passwordLength}>
        <label>Длина пароля:</label>
        <InputNumber
          size="small"
          id="passwordLength"
          value={passwordLength}
          onChange={handlePasswordLengthChange}
        />
      </div>
      <div className={styles.passwordValue}>{password}</div>
      <div className={styles.buttons}>
        <Button
          disabled={buttonDisabled}
          type="primary"
          size={"small"}
          icon={<FontAwesomeIcon icon={faRefresh} />}
          onClick={refreshPassword}
        ></Button>
        <Button
          disabled={buttonDisabled}
          type="primary"
          size={"small"}
          onClick={() => onSelection(password)}
        >
          Выбрать
        </Button>
      </div>
    </>
  );
};
