import {
  faEllipsisVertical,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Row, Col, Dropdown, MenuProps, Input, App } from "antd";
import classNames from "classnames";
import { AppError } from "helpers/app-error";
import { IPassword } from "modules/password/types/password-types";
import { FC } from "react";
import styles from "./password-view.module.scss";

export interface PasswordViewProps {
  password: IPassword;
  onEdit: () => void;
  onDelete: () => void;
}

const itemLayout = {
  labelCol: {
    xs: { span: 24 },
    xl: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    xl: { span: 18 },
  },
};

export const PasswordView: FC<PasswordViewProps> = ({
  password,
  onEdit,
  onDelete,
}) => {
  const { notification } = App.useApp();

  const menu: MenuProps["items"] = [
    {
      key: "edit",
      label: "Редактировать",
      icon: <FontAwesomeIcon icon={faPenToSquare} />,
      onClick: onEdit,
    },
    {
      key: "delete",
      label: "Удалить",
      icon: <FontAwesomeIcon icon={faTrashCan} />,
      onClick: onDelete,
    },
  ];

  const copyToClipboard = async (value: string, message: string) => {
    try {
      await navigator.clipboard.writeText(value);
      notification.destroy();
      notification.success({ message, duration: 1 });
    } catch (e) {
      notification.error({ message: "Ошибка копирования в буфер." });
      console.log(AppError(e));
    }
  };
  return (
    <div className={styles.layout}>
      <Row wrap={false}>
        <Col flex={"auto"}>
          <h1>{password.name}</h1>
        </Col>

        <Col flex="15px">
          <Dropdown
            menu={{ items: menu }}
            trigger={["hover"]}
            destroyPopupOnHide={false}
          >
            <div className={styles.editIcon}>
              <FontAwesomeIcon icon={faEllipsisVertical} />
            </div>
          </Dropdown>
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col className={styles.label} {...itemLayout.labelCol}>
          <span
            onClick={() =>
              copyToClipboard(
                password.login,
                `Имя пользователя "${password.name}" скопировано в буфер`,
              )
            }
          >
            Имя пользователя:
          </span>
        </Col>
        <Col className={styles.value}>{password.login}</Col>
      </Row>
      <Row className={styles.row}>
        <Col className={styles.label} {...itemLayout.labelCol}>
          <span
            onClick={() =>
              copyToClipboard(
                password.password,
                `Пароль "${password.name}" скопирован в буфер`,
              )
            }
          >
            Пароль:
          </span>
        </Col>
        <Col className={styles.value}>
          <Input.Password
            value={password.password}
            className={styles.password}
            bordered={false}
          />
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col className={styles.label} {...itemLayout.labelCol}>
          <span
            onClick={() =>
              copyToClipboard(
                password.url,
                `URL "${password.name}" скопирован в буфер`,
              )
            }
          >
            URL:
          </span>
        </Col>
        <Col
          className={classNames(styles.value, styles.url)}
          {...itemLayout.wrapperCol}
        >
          <a href={password.url} target="_blank" rel="noreferrer">
            {password.url}
          </a>
        </Col>
      </Row>
      <Row className={styles.row}>
        <Col className={styles.label} {...itemLayout.labelCol}>
          <span
            onClick={() =>
              copyToClipboard(
                password.groupName,
                `Группа "${password.name}" скопирована в буфер`,
              )
            }
          >
            Группа:
          </span>
        </Col>
        <Col className={styles.value}>{password.groupName}</Col>
      </Row>
      <Row className={styles.row}>
        <Col className={styles.label} {...itemLayout.labelCol}>
          <span
            onClick={() =>
              copyToClipboard(
                password.description,
                `Описание "${password.name}" скопировано в буфер`,
              )
            }
          >
            Описание:
          </span>
        </Col>
        <Col className={styles.value}>{password.description}</Col>
      </Row>
    </div>
  );
};
