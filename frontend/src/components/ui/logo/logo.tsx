import classNames from "classnames";
import styles from "./logo.module.scss";
import React, { FC } from "react";

interface LogoProps {
  className?: string;
}

export const Logo: FC<LogoProps> = ({ className }) => {
  return (
    <div className={classNames(styles.logo, className)}>
      <span>P</span>assword <span>M</span>anager
    </div>
  );
};
