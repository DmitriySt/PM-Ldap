import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Role } from 'modules/roles/models/roles.model';
import { UserRoles } from 'modules/roles/models/user-roles.model';

interface UserCreationAttrs {
  username: string;
  password: string;
  displayName: string;
}

@Table({
  tableName: 'users',
  schema: 'users',
})
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  username: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  displayName: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  banned: boolean;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];
}
