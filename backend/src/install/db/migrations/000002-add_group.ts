import { Migration } from 'install/db/db';
import { date, id } from 'install/db/dbFields';
import { DataTypes } from 'sequelize';

export const up: Migration = async ({ context: queryInterface }) =>
  queryInterface.sequelize.transaction(async (t) => {
    await queryInterface.createTable(
      { tableName: 'passwords_groups', schema: 'passwords' },
      {
        id,
        userId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: { tableName: 'users', schema: 'users' },
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        parentId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: { tableName: 'passwords_groups', schema: 'passwords' },
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        createdAt: date,
        updatedAt: date,
      },
      { transaction: t },
    );

    return queryInterface.addColumn(
      { tableName: 'passwords', schema: 'passwords' },
      'groupId',
      {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: { tableName: 'passwords_groups', schema: 'passwords' },
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      { transaction: t },
    );
  });

export const down: Migration = async ({ context: queryInterface }) =>
  queryInterface.sequelize.transaction(async (t) => {
    await queryInterface.removeColumn(
      { tableName: 'passwords', schema: 'passwords' },
      'groupId',
      { transaction: t },
    );
    return queryInterface.dropTable('passwords_groups', { transaction: t });
  });
