import { FC, ReactElement } from "react";
import { useAppSelector } from "store/store-hooks";
import { selectAuth } from "modules/auth";
import { useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";

interface IRouterRequireAuthProps {
  children: ReactElement;
  loginPath: string;
}

const RouterRequireAuth: FC<IRouterRequireAuthProps> = ({
  children,
  loginPath,
}) => {
  const { isAuth } = useAppSelector(selectAuth);
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }
  return children;
};

export default RouterRequireAuth;
