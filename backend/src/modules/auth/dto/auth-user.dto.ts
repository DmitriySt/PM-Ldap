import { IsString } from 'class-validator';

export class AuthUserDto {
  @IsString()
  public username: string;

  @IsString()
  readonly password: string;
}
