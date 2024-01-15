import { Min } from 'class-validator';
import { PasswordGroupAddDto } from './password-group-add.dto';

export class PasswordGroupEditDto extends PasswordGroupAddDto {
  @Min(1, { message: 'Значение задано не верно' })
  key: number;
}
