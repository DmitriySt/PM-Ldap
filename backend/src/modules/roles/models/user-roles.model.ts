import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Role } from './roles.model';
import { User } from 'modules/users/models/users.model';

interface RoleUserCreationAttrs {
  userId: number;
  roleId: number;
}

@Table({
  tableName: 'user_roles',
  schema: 'users',
  createdAt: false,
  updatedAt: false,
})
export class UserRoles extends Model<UserRoles, RoleUserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER })
  roleId: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;
}
