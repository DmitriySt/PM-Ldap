import { DownOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, TreeSelect } from "antd";
import { AppError } from "helpers/app-error";
import { usePasswordGroup } from "modules/password/hooks/usePasswordGroup";
import {
  addPasswordGroup,
  editPasswordGroup,
} from "modules/password/services/password-group-service";
import { IPasswordGroup } from "modules/password/types/password-group-types";
import { FC, useMemo, useState } from "react";
import styles from "./password-group-edit-form.module.scss";

export type actionType = "add" | "edit";

interface IPasswordGroupEditFormProps {
  passwordGroup: IPasswordGroup;
  onCancel: () => void;
  onSave: (group: IPasswordGroup) => void;
  action: actionType;
}

export const initEditFormValues: IPasswordGroup = {
  parentId: 0,
  title: "",
  key: 0,
};

const formItemLayout = {
  labelCol: {
    md: { span: 8 },
    sm: { span: 24 },
  },
  wrapperCol: {
    md: { span: 24 },
    sm: { span: 16 },
  },
};

export const PasswordGroupEditForm: FC<IPasswordGroupEditFormProps> = ({
  passwordGroup,
  onCancel,
  onSave,
  action,
}) => {
  const [editForm] = Form.useForm();
  const { groupTree } = usePasswordGroup();
  const [submit, setSubmit] = useState<boolean>(false);
  const formTitle = useMemo(() => {
    return action === "add"
      ? "Добавить группу"
      : `Редактировать "${passwordGroup.title}"`;
  }, [action, passwordGroup.title]);

  const initialValues = useMemo(() => {
    return action === "add"
      ? { ...initEditFormValues, parentId: passwordGroup.key }
      : passwordGroup;
  }, [action, passwordGroup]);

  const validateStatusReset = () => {
    const fields = editForm.getFieldsError().map((item) => {
      return {
        ...item,
        errors: [],
      };
    });
    editForm.setFields(fields);
  };

  const onFormSubmitHandler = async (formData: IPasswordGroup) => {
    setSubmit(true);
    validateStatusReset();
    try {
      const group =
        action === "add"
          ? await addPasswordGroup(formData)
          : await editPasswordGroup(formData);
      onSave(group);
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

  return (
    <>
      <h3>{formTitle}</h3>
      <Form
        {...formItemLayout}
        form={editForm}
        initialValues={initialValues}
        onFinish={onFormSubmitHandler}
        className={styles.form}
      >
        <Form.Item label="Родительская группа:" name="parentId">
          <TreeSelect
            treeLine
            switcherIcon={<DownOutlined />}
            fieldNames={{ label: "title", value: "key" }}
            treeData={groupTree.data}
          />
        </Form.Item>
        <Form.Item label="Наименование:" name="title">
          <Input />
        </Form.Item>
        <Form.Item name="key" hidden={true}>
          <Input type="hidden" />
        </Form.Item>
        <Row justify={"end"}>
          <Col>
            <Button type="primary" htmlType="submit" loading={submit}>
              Сохранить
            </Button>
          </Col>
          <Col>
            <Button
              htmlType="button"
              onClick={onCancel}
              className={styles.actionButton}
            >
              Отмена
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
};
