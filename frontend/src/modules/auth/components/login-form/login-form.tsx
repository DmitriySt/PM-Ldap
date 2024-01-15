import { ILoginData, loginAction, selectAuth } from "modules/auth/index";
import { FC } from "react";
import { Form, Input, Button, Alert, Row, Col } from "antd";
import { useAppDispatch, useAppSelector } from "store/store-hooks";
import styles from "modules/auth/components/login-form/login-form.module.css";

export const LoginForm: FC = () => {
  const { error } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();
  const login = async (loginData: ILoginData) => {
    dispatch(loginAction(loginData));
  };

  return (
    <div>
      <Row justify="center" className={styles.error}>
        <Col flex="auto">
          {error.length > 0 && <Alert message={error} type="error" showIcon />}
        </Col>
      </Row>
      <Row>
        <Col flex={"auto"}>
          <Form
            className={styles.form}
            name="login-form"
            labelCol={{
              span: 9,
            }}
            wrapperCol={{
              span: 15,
            }}
            onFinish={login}
            autoComplete="off"
          >
            <Form.Item
              label="Имя пользователя:"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Введите имя пользователя!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Пароль:"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Введите пароль!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item className={styles.button}>
              <Button type="primary" htmlType="submit">
                Вход
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};
