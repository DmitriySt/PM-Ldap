import type { Migration } from 'install/db/db';
import { DataTypes } from 'sequelize';
import { date, id } from 'install/db/dbFields';

export const up: Migration = async ({ context: queryInterface }) =>
  queryInterface.sequelize.transaction(async (t) => {
    await queryInterface.createSchema('users');
    await queryInterface.createTable(
      { tableName: 'users', schema: 'users' },
      {
        id,
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        displayName: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        banned: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        createdAt: date,
        updatedAt: date,
      },
      { transaction: t },
    );
    await queryInterface.createTable(
      { tableName: 'roles', schema: 'users' },
      {
        id,
        value: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        createdAt: date,
        updatedAt: date,
      },
      { transaction: t },
    );
    await queryInterface.bulkInsert(
      { tableName: 'roles', schema: 'users' },
      [
        {
          value: 'USER',
          description: 'Users',
        },
      ],
      { transaction: t },
    );

    await queryInterface.createTable(
      { tableName: 'user_roles', schema: 'users' },
      {
        id,
        roleId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: { tableName: 'roles', schema: 'users' },
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        userId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: { tableName: 'users', schema: 'users' },
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
      },
      { transaction: t },
    );

    await queryInterface.createTable(
      { tableName: 'tokens', schema: 'users' },
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
        refreshToken: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        createdAt: date,
        updatedAt: date,
      },
      { transaction: t },
    );

    await queryInterface.createSchema('passwords');
    await queryInterface.createTable(
      { tableName: 'passwords', schema: 'passwords' },
      {
        id,
        userId: {
          type: DataTypes.INTEGER,
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
        login: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        url: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        createdAt: date,
        updatedAt: date,
      },
      { transaction: t },
    );
  });
export const down: Migration = async ({ context: queryInterface }) =>
  queryInterface.sequelize.transaction(async (t) => {
    await queryInterface.dropTable(
      {
        tableName: 'passwords',
        schema: 'passwords',
      },
      { transaction: t },
    );
    await queryInterface.dropSchema('passwords', { transaction: t });
    await queryInterface.dropTable(
      { tableName: 'tokens', schema: 'users' },
      { transaction: t },
    );
    await queryInterface.dropTable(
      {
        tableName: 'user_roles',
        schema: 'users',
      },
      { transaction: t },
    );
    await queryInterface.dropTable(
      { tableName: 'roles', schema: 'users' },
      { transaction: t },
    );
    await queryInterface.dropTable(
      { tableName: 'users', schema: 'users' },
      { transaction: t },
    );
    return queryInterface.dropSchema('users', { transaction: t });
  });
