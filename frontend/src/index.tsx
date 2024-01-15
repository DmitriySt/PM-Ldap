import { ConfigProvider, App as AntApp } from "antd";
import ruRU from "antd/es/locale/ru_RU";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "store/store";
import App from "components/app/app";
import "./index.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ConfigProvider
    locale={ruRU}
    theme={{
      components: {
        TreeSelect: {
          colorPrimaryBorder: "transpanent",
        },
      },
    }}
  >
    <AntApp>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </AntApp>
  </ConfigProvider>
);
