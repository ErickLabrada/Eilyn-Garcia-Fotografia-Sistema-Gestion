import { Module } from '@nestjs/common';
import { BundleController } from './bundle.controller';
import { BundleService } from './bundle.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bundle } from 'src/Domain/bundle.entity';
import { AppointmentTemplate } from 'src/Domain/appointment.template.entity';
import { Contract } from 'src/Domain/contract.entity';
import { Item } from 'src/Domain/item.entity';
import { Event } from 'src/Domain/event.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Bundle,AppointmentTemplate,Contract,Item,Event])],
  controllers: [BundleController],
  providers: [BundleService]
})
export class BundleModule {}
