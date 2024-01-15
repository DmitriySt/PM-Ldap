import { Logo } from "components/ui/logo/logo";
import { FC, useEffect } from "react";
import { LoginForm } from "modules/auth";
import styles from "./login-page.module.scss";
import { selectAuth } from "modules/auth";
import { useAppSelector } from "store/store-hooks";
import { useNavigate } from "react-router-dom";

export const LoginPage: FC = () => {
  const { isAuth } = useAppSelector(selectAuth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate("/", { replace: true });
    }
  }, [isAuth, navigate]);

  return (
    <div className={styles.loginLayout}>
      <Logo className={styles.logo} />
      <LoginForm />
    </div>
  );
};
