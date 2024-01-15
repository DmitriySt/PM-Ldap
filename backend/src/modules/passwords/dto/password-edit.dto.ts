import { IsInt, IsNotEmpty } from 'class-validator';
import { PasswordAddDto } from 'modules/passwords/dto/password-add.dto';

export class PasswordEditDto extends PasswordAddDto {
  @IsNotEmpty({ message: 'Значение задано не верно' })
  @IsInt()
  id = 0;
}
