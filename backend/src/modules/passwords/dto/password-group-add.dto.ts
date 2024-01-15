import { Min, MinLength } from 'class-validator';

export class PasswordGroupAddDto {
  @MinLength(1, { message: 'Поле не может быть пустым' })
  title = '';

  @Min(1, { message: 'Значение задано не верно' })
  parentId: number;
}
