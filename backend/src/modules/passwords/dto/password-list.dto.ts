import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class PasswordListDto {
  @IsNotEmpty({ message: 'Значение задано не верно' })
  @IsInt({ message: 'Значение задано не верно' })
  @Min(1, { message: 'Значение задано не верно' })
  groupId: number;
}
