import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CryptoService } from 'modules/auth/services/crypto.service';
import { PasswordGroupAddDto } from 'modules/passwords/dto/password-group-add.dto';
import { PasswordGroupEditDto } from 'modules/passwords/dto/password-group-edit.dto';
import { PasswordGroup } from 'modules/passwords/models/password-group.model';
import { PasswordService } from 'modules/passwords/services/password.service';
import {
  IPasswordGroup,
  IPasswordGroupDefault,
  IPasswordGroupTree,
} from 'modules/passwords/types/password-group.types';
import { QueryTypes } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class PasswordGroupService {
  constructor(
    private cryptoService: CryptoService,
    private passwordService: PasswordService,
    @InjectModel(PasswordGroup)
    public passwordGroupRepository: typeof PasswordGroup,
    private sequelize: Sequelize,
  ) {}

  async addDefaultGroups(userId: number) {
    const defaultGroups: IPasswordGroupDefault[] = [{ title: 'Мои пароли' }];

    return Promise.all<IPasswordGroupTree>(
      defaultGroups.map(async (group) => {
        const _group = await this.passwordGroupRepository.create({
          name: await this.cryptoService.crypt(group.title),
          parentId: null,
          userId,
        });

        /* TODO: после миграции пользователей убрать update*/
        await this.passwordService.passwordRepository.update(
          {
            groupId: _group.id,
          },
          {
            where: { userId },
          },
        );

        return {
          key: _group.id,
          title: group.title,
          parentId: Number(_group.parentId),
        };
      }),
    );
  }

  async createGroupTree(
    tree: IPasswordGroup[],
    parentId: number | null,
  ): Promise<IPasswordGroupTree[]> {
    const items: IPasswordGroupTree[] = [];
    const groups = tree.filter(
      (group: IPasswordGroup) => group.parentId === parentId,
    );
    if (groups.length === 0) {
      return items;
    }
    for (const group of groups) {
      const children = await this.createGroupTree(tree, group.id);
      const item: IPasswordGroupTree = {
        key: group.id,
        title: await this.cryptoService.decrypt(group.name),
        parentId: Number(group.parentId),
      };
      if (children.length > 0) {
        item.children = children;
      }
      items.push(item);
    }
    items.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });
    return items;
  }

  async getPasswordGroupTree(userId: number) {
    const groups = (await this.sequelize.query(
      'WITH RECURSIVE r(id, "name","parentId",level) AS (' +
        'SELECT id, "name","parentId", 1 AS level ' +
        'FROM passwords.passwords_groups pg ' +
        'WHERE "userId" = $userId AND "parentId" IS NULL ' +
        'UNION ALL ' +
        'SELECT pg2.id,pg2."name", pg2."parentId" , r.level + 1 AS level ' +
        'FROM passwords.passwords_groups pg2 ' +
        'JOIN r ON  (r.id =pg2."parentId")) ' +
        'select * from r;',
      {
        type: QueryTypes.SELECT,
        bind: {
          userId,
        },
      },
    )) as IPasswordGroup[];
    if (groups.length === 0) {
      return await this.addDefaultGroups(userId);
    }
    return this.createGroupTree(groups, null);
  }

  async addGroup(passwordGroupAddDto: PasswordGroupAddDto, userId: number) {
    const group = await this.passwordGroupRepository.findOne({
      where: {
        userId,
        id: passwordGroupAddDto.parentId,
      },
      raw: true,
    });
    if (!group) {
      throw new HttpException('Ошибка сохранения', HttpStatus.BAD_REQUEST);
    }

    return await this.passwordGroupRepository.create({
      name: await this.cryptoService.crypt(passwordGroupAddDto.title),
      parentId: passwordGroupAddDto.parentId,
      userId,
    });
  }

  async editGroup(passwordGroupEditDto: PasswordGroupEditDto, userId: number) {
    const group = await this.passwordGroupRepository.findOne({
      where: {
        userId,
        id: passwordGroupEditDto.key,
      },
    });
    if (!group || group.parentId === null) {
      throw new HttpException('Ошибка сохранения', HttpStatus.BAD_REQUEST);
    }
    group.name = await this.cryptoService.crypt(passwordGroupEditDto.title);
    group.parentId = passwordGroupEditDto.parentId;
    return group.save();
  }

  async deleteGroup(groupId: number, userId: number) {
    const group = await this.passwordGroupRepository.findOne({
      where: {
        userId,
        id: groupId,
      },
    });
    if (!group || group.parentId === null) {
      throw new HttpException('Ошибка сохранения', HttpStatus.BAD_REQUEST);
    }

    const t = await this.sequelize.transaction();
    try {
      await this.passwordGroupRepository.destroy({
        where: {
          userId,
          id: groupId,
        },
        transaction: t,
      });
      t.commit();
      return true;
    } catch (e) {
      t.rollback();
      console.log(e);
      return false;
    }
  }
}
