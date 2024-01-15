import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CryptoService } from 'modules/auth/services/crypto.service';
import { PasswordEditDto } from 'modules/passwords/dto/password-edit.dto';
import { PasswordListDto } from 'modules/passwords/dto/password-list.dto';
import { IPassword } from 'modules/passwords/types/password.types';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { PasswordAddDto } from '../dto/password-add.dto';
import { Password } from '../models/password.model';

@Injectable()
export class PasswordService {
  constructor(
    private cryptoService: CryptoService,
    @InjectModel(Password) public passwordRepository: typeof Password,
    private sequelize: Sequelize,
  ) {}

  async cryptPassword(passwordDto: PasswordAddDto): Promise<PasswordAddDto> {
    const keys: string[] = [];
    const encryption: Promise<string>[] = [];
    Object.keys(passwordDto).forEach((key: string) => {
      if (typeof passwordDto[key] === 'string') {
        encryption.push(this.cryptoService.crypt(passwordDto[key]));
        keys.push(key);
      }
    });
    const encrypted = await Promise.all(encryption);
    keys.forEach((item, index) => (passwordDto[item] = encrypted[index]));
    return passwordDto;
  }

  async decryptPassword<T>(passwordModel: T, keys: (keyof T)[]): Promise<T> {
    const decrypted = await Promise.all(
      keys.map((key) =>
        this.cryptoService
          .decrypt(passwordModel[key].toString())
          .then((value) => {
            return {
              key,
              value,
            };
          }),
      ),
    );
    decrypted.forEach((item) => {
      passwordModel[item.key.toString()] = item.value;
    });
    return passwordModel;
  }

  async addPassword(
    passwordAddDto: PasswordAddDto,
    userId: number,
  ): Promise<boolean> {
    try {
      passwordAddDto = await this.cryptPassword(passwordAddDto);
      await this.passwordRepository.create({
        userId,
        ...passwordAddDto,
      });
      return true;
    } catch {
      throw new HttpException('Ошибка сохранения', HttpStatus.BAD_REQUEST);
    }
  }

  async editPassword(
    passwordEditDto: PasswordEditDto,
    userId: number,
  ): Promise<boolean> {
    try {
      const password = await this.passwordRepository.findOne({
        where: {
          id: passwordEditDto.id,
          userId,
        },
      });
      if (!password) {
        throw new HttpException('Ошибка сохранения', HttpStatus.BAD_REQUEST);
      }
      const passwordDto = await this.cryptPassword({ ...passwordEditDto });
      await password.update({ ...passwordDto, userId, id: password.id });
      return true;
    } catch {
      throw new HttpException('Ошибка сохранения', HttpStatus.BAD_REQUEST);
    }
  }

  async delPassword(id: number, userId: number): Promise<boolean> {
    try {
      const del = await this.passwordRepository.destroy({
        where: { id, userId },
      });
      if (del === 1) {
        return true;
      }
      throw new HttpException('Ошибка удаления', HttpStatus.BAD_REQUEST);
    } catch {
      throw new HttpException('Ошибка удаления', HttpStatus.BAD_REQUEST);
    }
  }

  async getPasswords(
    passwordListDto: PasswordListDto,
    userId: number,
  ): Promise<Password[]> {
    const passwordsList = (await this.sequelize.query(
      'WITH RECURSIVE r("groupId", "groupName","groupParentId") AS (' +
        'SELECT ' +
        'pg.id as "groupId", ' +
        'pg."name" as "groupName",' +
        'pg."parentId" as "groupParentId" ' +
        'FROM passwords.passwords_groups pg ' +
        'WHERE pg."userId" = $userId AND pg.id  = $groupId ' +
        'UNION ALL ' +
        'SELECT ' +
        'pg2.id,' +
        'pg2."name", ' +
        'pg2."parentId"  ' +
        'FROM passwords.passwords_groups pg2 ' +
        'JOIN r ON  (r."groupId" =pg2."parentId")) ' +
        'select ' +
        'r."groupName", ' +
        'p.* ' +
        'from r ' +
        'join passwords.passwords p on(p."groupId" = r."groupId")',
      {
        type: QueryTypes.SELECT,
        bind: {
          userId,
          groupId: passwordListDto.groupId,
        },
      },
    )) as IPassword[];
    return Promise.all(
      passwordsList.map((item) => {
        return this.decryptPassword<IPassword>(item, [
          'name',
          'login',
          'password',
          'url',
          'description',
          'groupName',
        ]);
      }),
    );
  }
}
