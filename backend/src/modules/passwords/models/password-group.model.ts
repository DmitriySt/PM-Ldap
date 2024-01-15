import { User } from 'modules/users/models/users.model';
import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';

interface PasswordGroupCreationAttr {
  userId: number;
  name: string;
  parentId: number;
}

@Table({
  tableName: 'passwords_groups',
  schema: 'passwords',
})
export class PasswordGroup extends Model<
  PasswordGroup,
  PasswordGroupCreationAttr
> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  parentId: number;
}
