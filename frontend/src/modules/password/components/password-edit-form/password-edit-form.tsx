import { DownOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, TreeSelect } from "antd";
import classNames from "classnames";
import { AppError } from "helpers/app-error";
import { usePasswordGroup } from "modules/password/hooks/usePasswordGroup";
import {
  addPassword,
  editPassword,
} from "modules/password/services/password-service";
import styles from "modules/password/components/password-edit-form/password-edit-form.module.scss";
import { IPassword } from "modules/password/types/password-types";
import { FC, useMemo, useState } from "react";
import { PasswordField } from "./password-field";

export interface IPasswordEditFormProps {
  onCancel: () => void;
  onSave: (name: string) => void;
  passwordItem: IPassword;
}

const PasswordEditForm: FC<IPasswordEditFormProps> = ({
  passwordItem,
  onSave,
  onCancel,
}) => {
  const [editForm] = Form.useForm();
  const { groupTree } = usePasswordGroup();
  const initialValues = useMemo<IPassword>(() => {
    return { ...passwordItem };
  }, [passwordItem]);
  const [submit, setSubmit] = useState<boolean>(false);

  const handlerOnFinish = async (formData: IPassword) => {
    setSubmit(true);
    validateStatusReset();
    try {
      const action = formData.id > 0 ? editPassword : addPassword;
      await action(formData);
      onSave(formData.name);
    } catch (e) {
      const { validationErrors } = AppError(e);
      if (validationErrors) {
        editForm.setFields(validationErrors);
      } else {
        console.log(AppError(e));
      }
    }
    setSubmit(false);
  };

  const handlerOnCancel = () => {
    onCancel();
  };

  const validateStatusReset = () => {
    const fields = editForm.getFieldsError().map((item) => {
      return {
        ...item,
        errors: [],
      };
    });
    editForm.setFields(fields);
  };

  return (
    <div className={styles.layout}>
      <Form
        form={editForm}
        className={classNames(styles.form, "responsive-form")}
        onFinish={handlerOnFinish}
        layout={"vertical"}
        initialValues={initialValues}
      >
        <Form.Item label="Группа:" name="groupId">
          <TreeSelect
            treeLine
            switcherIcon={<DownOutlined />}
            fieldNames={{ label: "title", value: "key" }}
            treeData={groupTree.data}
          />
        </Form.Item>
        <Form.Item label="Наименование" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="Имя пользователя" name="login">
          <Input />
        </Form.Item>
        <Form.Item label="Пароль" name="password">
          <PasswordField />
        </Form.Item>

        <Form.Item label="URL" name="url">
          <Input />
        </Form.Item>
        <Form.Item label="Описание" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="id" hidden={true}>
          <Input type="hidden" />
        </Form.Item>

        <Row justify="end">
          <Col>
            <Button type="primary" htmlType="submit" loading={submit}>
              Сохранить
            </Button>
          </Col>
          <Col>
            <Button
              htmlType="button"
              onClick={handlerOnCancel}
              className={styles.actionButton}
            >
              Отмена
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default PasswordEditForm;
