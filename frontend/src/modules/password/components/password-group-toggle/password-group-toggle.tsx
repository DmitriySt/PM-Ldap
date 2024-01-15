import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { usePasswordGroup } from "modules/password/hooks/usePasswordGroup";
import { FC } from "react";
import styles from "./password-group-toggle.module.scss";

interface IPasswordGroupToggleProps {
  className?: string;
}

export const PasswordGroupToggle: FC<IPasswordGroupToggleProps> = ({
  className,
}) => {
  const { groupTreeToggle } = usePasswordGroup();

  return (
    <div
      className={classNames([styles.toggle, className])}
      onClick={groupTreeToggle}
    >
      <FontAwesomeIcon icon={faBars} />
    </div>
  );
};
