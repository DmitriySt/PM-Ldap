import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'modules/users/models/users.model';

interface TokenCreationAttrs {
  userId: number;
  refreshToken: string;
}

@Table({
  tableName: 'tokens',
  schema: 'users',
})
export class Token extends Model<Token, TokenCreationAttrs> {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  refreshToken: string;
}
