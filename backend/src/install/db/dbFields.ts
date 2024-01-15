import sequelize, { DataTypes } from 'sequelize';
import { ModelAttributeColumnOptions } from 'sequelize/types/model';

export const id: ModelAttributeColumnOptions = {
  type: DataTypes.INTEGER,
  allowNull: false,
  primaryKey: true,
  autoIncrement: true,
};

export const date: ModelAttributeColumnOptions = {
  type: DataTypes.DATE,
  defaultValue: sequelize.fn('now'),
};
