import { IsInt, IsNotEmpty, IsOptional, MaxLength, Min } from 'class-validator';

export class PasswordAddDto {
  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @MaxLength(100, { message: 'Максимум 100 знаков.' })
  name = '';

  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @MaxLength(100, { message: 'Максимум 100 знаков.' })
  login = '';

  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @MaxLength(100, { message: 'Максимум 100 знаков.' })
  password = '';

  @IsOptional()
  url = '';

  @IsOptional()
  description = '';

  @IsNotEmpty({ message: 'Поле не может быть пустым' })
  @IsInt()
  @Min(1, { message: 'Значение задано не верно' })
  groupId = 0;
}
