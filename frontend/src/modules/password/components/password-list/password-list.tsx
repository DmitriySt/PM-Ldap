import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Col, Input, Row } from "antd";
import classNames from "classnames";
import { useDebounce } from "hooks/useDebounce";
import { usePasswordGroup } from "modules/password/hooks/usePasswordGroup";
import { IPassword } from "modules/password/types/password-types";
import { FC, startTransition, useMemo, useState } from "react";
import styles from "./password-list.module.scss";

export interface PasswordListProps {
  passwordList: IPassword[];
  currentRow: IPassword;
  onChange: (password: IPassword) => void;
  onNewRecord: () => void;
}

const filteredPasswords = (passwordList: IPassword[], searchString: string) => {
  if (searchString.length === 0) {
    return passwordList;
  }
  const _searchString = new RegExp(searchString, "i");
  return passwordList.filter((item) => {
    const searchFields: (keyof IPassword)[] = [
      "name",
      "login",
      "url",
      "description",
    ];
    for (const field of searchFields) {
      if (_searchString.test(item[field].toString())) {
        return true;
      }
    }
    return false;
  });
};

export const PasswordList: FC<PasswordListProps> = ({
  passwordList,
  onChange,
  onNewRecord,
  currentRow,
}) => {
  const { passwordGroup } = usePasswordGroup();
  const [searchString, setSearchString] = useState<string>("");
  const searchStringDebounced = useDebounce(searchString, 500);
  const list = useMemo<IPassword[]>(
    () => filteredPasswords(passwordList, searchStringDebounced),
    [passwordList, searchStringDebounced],
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const _searchString = e.target.value;
    startTransition(() => setSearchString(_searchString));
  };

  return (
    <div className={styles.layout}>
      <Row className={styles.actionPanel} wrap={false} align={"middle"}>
        <Col flex={"auto"}>
          <Input
            placeholder="Поиск"
            name="search"
            prefix={<FontAwesomeIcon icon={faMagnifyingGlass} />}
            allowClear
            onChange={handleSearch}
          />
        </Col>
        <Col flex="40px" className={styles.buttons}>
          <Button
            size="small"
            type="primary"
            icon={<FontAwesomeIcon icon={faPlus} />}
            title="Добавить запись"
            onClick={onNewRecord}
            disabled={passwordGroup.key === 0}
          ></Button>
        </Col>
      </Row>
      <div className={styles.listLayout}>
        <div className={styles.list}>
          {list.map((item) => (
            <div
              key={item.id}
              className={classNames(
                styles.listItem,
                currentRow.id === item.id ? styles.active : "",
              )}
              onClick={() => onChange(item)}
            >
              <div>{item.name}</div>
              <div>{item.login}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
