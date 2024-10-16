import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from 'src/Domain/status.entity';
import { Contract } from 'src/Domain/contract.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Status,Contract])],
  controllers: [StatusController],
  providers: [StatusService]
})
export class StatusModule {}
