export class UserLdapDto {
  readonly displayName: string;
  readonly memberOf: string | string[] | Buffer | Buffer[];
}
