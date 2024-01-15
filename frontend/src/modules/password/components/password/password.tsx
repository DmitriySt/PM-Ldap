import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row, Modal, App, Button } from "antd";
import classNames from "classnames";
import PasswordEditForm from "modules/password/components/password-edit-form/password-edit-form";
import PasswordGroupTree from "modules/password/components/password-group-tree/password-group-tree";
import { PasswordList } from "modules/password/components/password-list/password-list";
import { PasswordView } from "modules/password/components/password-view/password-view";
import { usePasswordGroup } from "modules/password/hooks/usePasswordGroup";
import {
  deletePassword,
  getPaswwordList,
} from "modules/password/services/password-service";
import { IPassword } from "modules/password/types/password-types";
import { FC, useCallback, useEffect, useMemo, useState } from "react";
import styles from "modules/password/components/password/password.module.scss";

export const Password: FC = () => {
  const { notification } = App.useApp();
  const { passwordGroup, groupTreeOpen } = usePasswordGroup();
  const initPasswordValues = useMemo<IPassword>(() => {
    return {
      id: 0,
      name: "",
      login: "",
      password: "",
      url: "",
      description: "",
      groupId: passwordGroup.key,
      groupName: passwordGroup.title,
    };
  }, [passwordGroup]);

  const [passwordList, setPasswordList] = useState<IPassword[]>([]);
  const [passwordRow, setPasswordRow] = useState<IPassword>(initPasswordValues);
  const [editFormOpen, setEditFormOpen] = useState<boolean>(false);
  const [deleteFormOpen, setDeleteFormOpen] = useState<boolean>(false);
  const viewComponentOpen = useMemo<boolean>(
    () => passwordRow.id > 0 || editFormOpen,
    [passwordRow.id, editFormOpen],
  );

  const updatePasswordList = useCallback(async () => {
    setPasswordList(await getPaswwordList(passwordGroup.key));
  }, [passwordGroup.key]);

  const handleCancelDeleteForm = () => {
    setDeleteFormOpen(false);
  };

  const handleSaveDeleteForm = async () => {
    await deletePassword(passwordRow.id);
    setPasswordRow(initPasswordValues);
    updatePasswordList();
    setDeleteFormOpen(false);
    notification.success({ message: `Запись "${passwordRow.name}" удалена.` });
  };

  const handleCancelEditForm = () => {
    setEditFormOpen(false);
  };

  const handleSaveEditForm = (name: string) => {
    notification.success({ message: `Запись "${name}" сохранена.` });
    setPasswordRow(initPasswordValues);
    updatePasswordList();
    setEditFormOpen(false);
  };

  const handleShowAddForm = () => {
    setPasswordRow(initPasswordValues);
    setEditFormOpen(true);
  };

  const handleViewComponentClose = () => {
    setPasswordRow(initPasswordValues);
    setEditFormOpen(false);
  };

  useEffect(() => {
    if (passwordGroup.key > 0) {
      updatePasswordList();
      setPasswordRow(initPasswordValues);
      setEditFormOpen(false);
    }
  }, [initPasswordValues, passwordGroup.key, updatePasswordList]);

  useEffect(() => {
    if (passwordRow.id > 0) {
      setEditFormOpen(false);
    }
  }, [passwordRow.id]);

  const ViewComponent = () => {
    if (editFormOpen) {
      return (
        <PasswordEditForm
          onCancel={handleCancelEditForm}
          onSave={handleSaveEditForm}
          passwordItem={passwordRow}
        />
      );
    }

    if (passwordRow.id > 0) {
      return (
        <PasswordView
          password={passwordRow}
          onEdit={() => setEditFormOpen(true)}
          onDelete={() => setDeleteFormOpen(true)}
        />
      );
    }
    return null;
  };

  const ViewComponentClose = () => {
    return (
      <div className={styles.viewLayoutClose}>
        <Button type="link" onClick={handleViewComponentClose}>
          <FontAwesomeIcon icon={faCircleLeft} /> Назад
        </Button>
      </div>
    );
  };

  return (
    <div className={styles.layout}>
      <Row wrap={false} className={styles.layout}>
        <Col
          className={classNames([
            styles.groupLayout,
            { [styles.groupLayoutActive]: groupTreeOpen },
          ])}
        >
          <PasswordGroupTree />
        </Col>
        <Col flex="auto" className={styles.layout}>
          <Row className={styles.layout} wrap={false}>
            <Col xs={24} lg={10}>
              <PasswordList
                passwordList={passwordList}
                onChange={setPasswordRow}
                currentRow={passwordRow}
                onNewRecord={handleShowAddForm}
              />
            </Col>
            <Col
              className={classNames([
                styles.viewLayout,
                { [styles.viewLayoutActive]: viewComponentOpen },
              ])}
            >
              {viewComponentOpen && <ViewComponentClose />}
              <ViewComponent />
            </Col>
          </Row>
        </Col>
      </Row>

      <Modal
        centered={true}
        maskClosable={false}
        closable={false}
        open={deleteFormOpen}
        okText="Удалить"
        destroyOnClose={true}
        onCancel={handleCancelDeleteForm}
        onOk={handleSaveDeleteForm}
      >
        <div>
          Будет удалена запись: "{passwordRow.name}". Восстановить данные будет
          не возможно!
        </div>
      </Modal>
    </div>
  );
};
