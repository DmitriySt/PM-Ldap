import { FC } from "react";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch } from "store/store-hooks";
import { IUserInfo, logoutAction } from "modules/auth";
import styles from "./main-top-menu.module.scss";

export interface IMainTopMenuProps {
  userInfo: IUserInfo;
}

const MainTopMenu: FC<IMainTopMenuProps> = ({ userInfo }) => {
  const dispatch = useAppDispatch();

  const logout = async () => {
    dispatch(logoutAction());
  };

  const items: MenuProps["items"] = [
    {
      label: userInfo.displayName,
      key: "userInfo",
      icon: <FontAwesomeIcon icon={faUser} />,
      className: styles.userInfo,
    },
    {
      key: "userExit",
      icon: <FontAwesomeIcon icon={faRightFromBracket} />,
      title: "Выход",
      onClick: () => logout(),
      className: styles.userExit,
    },
  ];

  return (
    <Menu
      mode={"horizontal"}
      items={items}
      theme="dark"
      className={styles.menu}
    />
  );
};

export default MainTopMenu;
