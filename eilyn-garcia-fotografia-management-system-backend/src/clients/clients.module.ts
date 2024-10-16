import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from 'src/Domain/client.entity';
import { Contract } from 'src/Domain/contract.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Client, Contract])],
  controllers: [ClientsController],
  providers: [ClientsService]
})
export class ClientsModule {}
