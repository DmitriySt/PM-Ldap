import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthRequest } from 'modules/auth/types/auth-request.interface';
import { PasswordEditDto } from 'modules/passwords/dto/password-edit.dto';
import { PasswordListDto } from 'modules/passwords/dto/password-list.dto';
import { PasswordService } from 'modules/passwords/services/password.service';
import { PasswordAddDto } from '../dto/password-add.dto';
import { ROLE_USER } from 'modules/roles/const';
import { RolesGuard } from 'modules/auth/guards/roles.guard';
import { Roles } from 'modules/auth/decorators/roles-auth.decorator';

@Controller('passwords')
export class PasswordsController {
  constructor(private passwordService: PasswordService) {}

  @Roles(ROLE_USER)
  @UseGuards(RolesGuard)
  @Post('/add')
  addPassword(
    @Body() passwordAddDto: PasswordAddDto,
    @Req() request: AuthRequest,
  ) {
    return this.passwordService.addPassword(passwordAddDto, request.user.id);
  }

  @Roles(ROLE_USER)
  @UseGuards(RolesGuard)
  @Post('/edit')
  editPassword(
    @Body() passwordEditDto: PasswordEditDto,
    @Req() request: AuthRequest,
  ) {
    return this.passwordService.editPassword(passwordEditDto, request.user.id);
  }

  @Roles(ROLE_USER)
  @UseGuards(RolesGuard)
  @Post('/delete')
  delPassword(
    @Body('passwordId') passwordId: number,
    @Req() request: AuthRequest,
  ) {
    return this.passwordService.delPassword(passwordId, request.user.id);
  }

  @Roles(ROLE_USER)
  @UseGuards(RolesGuard)
  @Post('/list')
  getPasswords(
    @Body() passwordListDto: PasswordListDto,
    @Req() request: AuthRequest,
  ) {
    return this.passwordService.getPasswords(passwordListDto, request.user.id);
  }
}
