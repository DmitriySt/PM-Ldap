import { Injectable } from '@nestjs/common';
import { CryptoService } from 'modules/auth/services/crypto.service';
import { UserCreateDto } from 'modules/users/dto/user-create.dto';
import { UserInfoDto } from 'modules/users/dto/user-info.dto';
import { User } from '../models/users.model';
import { InjectModel } from '@nestjs/sequelize';
import * as bcrypt from 'bcryptjs';
import { RolesService } from 'modules/roles/services/roles.service';
import { Role } from 'modules/roles/models/roles.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private rolesService: RolesService,
    private cryptoService: CryptoService,
  ) {}

  async findByName(username: string): Promise<User> {
    const _username = await this.cryptoService.crypt(username);
    const user = await this.userRepository.findOne({
      attributes: ['id', 'displayName'],
      include: [
        {
          model: Role,
          attributes: ['id', 'value'],
          through: { attributes: [] },
        },
      ],
      where: { username: _username },
    });
    if (user) {
      user.displayName = await this.cryptoService.decrypt(user.displayName);
    }

    return user;
  }

  async findById(userId: number): Promise<User> {
    const user = await this.userRepository.findByPk(userId, {
      attributes: ['id', 'displayName'],
      include: [
        {
          model: Role,
          attributes: ['id', 'value'],
          through: { attributes: [] },
        },
      ],
    });
    user.displayName = await this.cryptoService.decrypt(user.displayName);
    return user;
  }

  async createUser(userCreateDto: UserCreateDto): Promise<User> {
    const username = await this.cryptoService.crypt(userCreateDto.username);
    const displayName = await this.cryptoService.crypt(
      userCreateDto.displayName,
    );
    const hashPassword = await bcrypt.hash(userCreateDto.password, 8);
    const user = await this.userRepository.create({
      displayName,
      username,
      password: hashPassword,
    });
    await this.rolesService.setDefaultRole(user.id);
    return this.findById(user.id);
  }

  async userInfo(userId: number): Promise<UserInfoDto> {
    const { displayName } = await this.userRepository.findByPk(userId, {
      attributes: ['displayName'],
    });
    return { displayName: await this.cryptoService.decrypt(displayName) };
  }
}
