import React, { useEffect, useState } from "react";
import { Router } from "router";
import { refreshAction } from "modules/auth";
import { useAppDispatch } from "store/store-hooks";
import { Loader } from "components/ui/loader/loader";

const App = () => {
  const [appLoading, setAppLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadApp = async () => {
      await dispatch(refreshAction());
      setAppLoading(false);
    };
    loadApp();
  }, [dispatch]);

  return (
    <>
      <Loader show={appLoading} />
      <Router />
    </>
  );
};

export default App;
