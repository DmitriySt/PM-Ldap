import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '../models/roles.model';
import { UserRoles } from '../models/user-roles.model';
import { ROLE_USER } from '../const';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Role) private roleRepository: typeof Role,
    @InjectModel(UserRoles) private roleUserRepository: typeof UserRoles,
  ) {}

  async getRoleByValue(value: string): Promise<Role> {
    return this.roleRepository.findOne({ where: { value } });
  }

  async setDefaultRole(userId: number) {
    const role = await this.getRoleByValue(ROLE_USER);
    await this.setUserRole(userId, role.id);
  }

  async setUserRole(
    userId: number,
    roleId: number,
  ): Promise<[UserRoles, boolean]> {
    return this.roleUserRepository.findOrCreate({
      where: { userId, roleId },
      defaults: { userId, roleId },
    });
  }
}
