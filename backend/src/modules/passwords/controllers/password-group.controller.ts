import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'modules/auth/decorators/roles-auth.decorator';
import { RolesGuard } from 'modules/auth/guards/roles.guard';
import { AuthRequest } from 'modules/auth/types/auth-request.interface';
import { PasswordGroupAddDto } from 'modules/passwords/dto/password-group-add.dto';
import { PasswordGroupEditDto } from 'modules/passwords/dto/password-group-edit.dto';
import { ROLE_USER } from 'modules/roles/const';
import { PasswordGroupService } from '../services/password-group.service';

@Controller('password-group')
export class PasswordGroupController {
  constructor(private passwordGroupService: PasswordGroupService) {}

  @Roles(ROLE_USER)
  @UseGuards(RolesGuard)
  @Get('/get-group-tree')
  getUserGroup(@Req() request: AuthRequest) {
    return this.passwordGroupService.getPasswordGroupTree(request.user.id);
  }

  @Roles(ROLE_USER)
  @UseGuards(RolesGuard)
  @Post('/add-group')
  async addGroup(
    @Body() passwordGroupAddDto: PasswordGroupAddDto,
    @Req() request: AuthRequest,
  ) {
    const group = await this.passwordGroupService.addGroup(
      passwordGroupAddDto,
      request.user.id,
    );
    return {
      key: group.id,
      title: passwordGroupAddDto.title,
      parentId: group.parentId,
    };
  }

  @Roles(ROLE_USER)
  @UseGuards(RolesGuard)
  @Post('/edit-group')
  async editGroup(
    @Body() passwordGroupEditDto: PasswordGroupEditDto,
    @Req() request: AuthRequest,
  ) {
    const group = await this.passwordGroupService.editGroup(
      passwordGroupEditDto,
      request.user.id,
    );
    return {
      key: group.id,
      title: passwordGroupEditDto.title,
      parentId: group.parentId,
    };
  }

  @Roles(ROLE_USER)
  @UseGuards(RolesGuard)
  @Post('/del-group')
  async deleteGroup(
    @Body('groupId') groupId: number,
    @Req() request: AuthRequest,
  ) {
    return this.passwordGroupService.deleteGroup(
      Number(groupId),
      request.user.id,
    );
  }
}
