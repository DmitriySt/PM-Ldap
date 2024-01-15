import {
  faPenToSquare,
  faPlus,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { DownOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tree, TreeProps, Button, Modal, ConfigProvider, App } from "antd";
import classNames from "classnames";
import {
  actionType,
  initEditFormValues,
  PasswordGroupEditForm,
} from "modules/password/components/password-group-edit-form/password-group-edit-form";
import { PasswordGroupToggle } from "modules/password/components/password-group-toggle/password-group-toggle";
import { usePasswordGroup } from "modules/password/hooks/usePasswordGroup";
import { deletePasswordGroup } from "modules/password/services/password-group-service";
import { IPasswordGroup } from "modules/password/types/password-group-types";
import React, { FC, useState } from "react";
import { useAppDispatch } from "store/store-hooks";
import styles from "modules/password/components/password-group-tree/password-group-tree.module.scss";

const PasswordGroupTree: FC = () => {
  const { notification } = App.useApp();
  const dispatch = useAppDispatch();
  const { groupTree, passwordGroup, setPasswordGroup, updatePasswordGroup } =
    usePasswordGroup();
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [editFormAction, setEditFormAction] = useState<actionType>("add");
  const [showDelForm, setShowDelForm] = useState<boolean>(false);
  const [editRow, setEditRow] = useState<IPasswordGroup>(initEditFormValues);

  const handleGroupSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    if (info.selectedNodes.length > 0) {
      dispatch(setPasswordGroup(info.selectedNodes[0] as IPasswordGroup));
      setEditRow(info.selectedNodes[0] as IPasswordGroup);
    }
  };

  const handleAddGroup = () => {
    setEditFormAction("add");
    setShowEditForm(true);
  };

  const handleEditGroup = () => {
    setEditFormAction("edit");
    setShowEditForm(true);
  };

  const handleEditFormSave = (group: IPasswordGroup) => {
    if (group.key === editRow.key) {
      setEditRow(group);
    }
    updatePasswordGroup();
    setShowEditForm(false);
    notification.success({ message: `Группа ${group.title} сохранена.` });
  };

  const handleDeleteGroup = async () => {
    const group = { ...passwordGroup };
    const res = await deletePasswordGroup(group.key);
    if (res) {
      notification.success({
        message: `Группа ${group.title} удалена.`,
      });
      updatePasswordGroup();
      setPasswordGroup({ key: 0, title: "", parentId: 0 });
    } else {
      notification.error({
        message: `Ошибка удаления группы ${group.title}.`,
      });
    }
    setShowDelForm(false);
  };

  return (
    <>
      <div className={classNames([styles.treeLayout, {}])}>
        <div className={styles.buttonPanel}>
          <Button
            size="small"
            type="primary"
            icon={<FontAwesomeIcon icon={faPlus} />}
            title="Добавить группу"
            disabled={passwordGroup.key === 0}
            onClick={handleAddGroup}
          ></Button>
          <Button
            size="small"
            type="primary"
            icon={<FontAwesomeIcon icon={faPenToSquare} />}
            title="Редактировать группу"
            disabled={passwordGroup.parentId === 0}
            onClick={handleEditGroup}
          ></Button>
          <Button
            size="small"
            type="primary"
            icon={<FontAwesomeIcon icon={faTrashCan} />}
            title="Удалить группу"
            disabled={passwordGroup.parentId === 0}
            onClick={() => setShowDelForm(true)}
          ></Button>
          <PasswordGroupToggle className={styles.groupToggle} />
        </div>
        <div className={styles.tree}>
          {groupTree.data?.length > 0 && (
            <ConfigProvider
              theme={{
                token: {
                  controlItemBgActive: "#bfbfbf",
                  colorBgContainer: "inherit",
                },
              }}
            >
              <Tree
                showLine
                switcherIcon={<DownOutlined />}
                treeData={groupTree.data}
                onSelect={handleGroupSelect}
                selectedKeys={[passwordGroup.key]}
                defaultExpandedKeys={[groupTree.data[0]?.key]}
              />
            </ConfigProvider>
          )}
        </div>
      </div>
      <Modal
        open={showEditForm}
        closable={false}
        maskClosable={false}
        footer={null}
        width={700}
        destroyOnClose={true}
      >
        <PasswordGroupEditForm
          passwordGroup={editRow}
          onCancel={() => setShowEditForm(false)}
          onSave={handleEditFormSave}
          action={editFormAction}
        />
      </Modal>
      <Modal
        centered={true}
        maskClosable={false}
        closable={false}
        open={showDelForm}
        okText="Удалить"
        destroyOnClose={true}
        onCancel={() => setShowDelForm(false)}
        onOk={handleDeleteGroup}
      >
        <div>
          Будет удалена группа: <b>"{passwordGroup.title}"</b>. Восстановить
          данные будет не возможно!
        </div>
      </Modal>
    </>
  );
};

export default PasswordGroupTree;
