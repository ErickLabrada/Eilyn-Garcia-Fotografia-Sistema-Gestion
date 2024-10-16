import { Module } from '@nestjs/common';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from 'src/Domain/contract.entity';
import { Appointment } from 'src/Domain/appointment.entity';
import { Delivery } from 'src/Domain/delivery.entity';
import { Bundle } from 'src/Domain/bundle.entity';
import { Client } from 'src/Domain/client.entity';
import { Status } from 'src/Domain/status.entity';
import { Event } from 'src/Domain/event.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Contract,Appointment,Delivery,Bundle,Client,Event,Status])],
  controllers: [ContractsController],
  providers: [ContractsService]
})
export class ContractsModule {}
