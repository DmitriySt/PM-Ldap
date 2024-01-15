import { Password, PasswordGroupToggle } from "modules/password";
import React, { FC } from "react";
import { Col, Layout, Row } from "antd";
import styles from "./main-page.module.scss";
import { useAppSelector } from "store/store-hooks";
import { selectAuth } from "modules/auth";
import MainTopMenu from "components/main-top-menu/main-top-menu";

export const MainPage: FC = () => {
  const { userInfo } = useAppSelector(selectAuth);

  return (
    <Layout className={styles.main_layout}>
      <Layout.Header className={styles.header}>
        <Row>
          <Col sm={0}>
            <PasswordGroupToggle className={styles.groupToggle} />
          </Col>
          <Col>
            <h1>
              <span>P</span>assword <span>M</span>anager
            </h1>
          </Col>
          <Col flex="auto">
            <MainTopMenu userInfo={userInfo} />
          </Col>
        </Row>
      </Layout.Header>
      <Layout.Content className={styles.content}>
        <Password />
      </Layout.Content>
      <Layout.Footer className={styles.footer}>
        {process.env.REACT_APP_VERSION}
      </Layout.Footer>
    </Layout>
  );
};
