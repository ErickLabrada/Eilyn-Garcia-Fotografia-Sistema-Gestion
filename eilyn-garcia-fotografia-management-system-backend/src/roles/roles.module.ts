import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Rol } from 'src/Domain/rol.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([Rol])],
  providers: [RolesService],
  controllers: [RolesController]
})
export class RolesModule {}
