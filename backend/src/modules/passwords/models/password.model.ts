import { PasswordGroup } from 'modules/passwords/models/password-group.model';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'modules/users/models/users.model';

interface PasswordCreationAttrs {
  userId: number;
  name: string;
  login: string;
  password: string;
  url: string;
  description: string;
  groupId: number;
}

@Table({
  tableName: 'passwords',
  schema: 'passwords',
})
export class Password extends Model<Password, PasswordCreationAttrs> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  login: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: true })
  url: string;

  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @ForeignKey(() => PasswordGroup)
  @Column({ type: DataType.INTEGER, allowNull: false })
  groupId: number;
}
