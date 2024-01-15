import { Module } from '@nestjs/common';
import { RolesService } from './services/roles.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role } from './models/roles.model';
import { UserRoles } from './models/user-roles.model';

@Module({
  providers: [RolesService],
  imports: [SequelizeModule.forFeature([Role, UserRoles])],
  exports: [RolesService],
})
export class RolesModule {}
