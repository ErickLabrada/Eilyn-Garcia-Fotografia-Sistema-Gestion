import { Module } from '@nestjs/common';
import { CustomBundlesController } from './custom-bundles.controller';
import { CustomBundlesService } from './custom-bundles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomBundle } from 'src/Domain/custom.bundle.entity';
import { AppointmentTemplate } from 'src/Domain/appointment.template.entity';
import { Contract } from 'src/Domain/contract.entity';
import { Item } from 'src/Domain/item.entity';
import { Event } from 'src/Domain/event.entity';

@Module({
  imports:[TypeOrmModule.forFeature([CustomBundle,AppointmentTemplate,Contract,Item,Event])],
  controllers: [CustomBundlesController],
  providers: [CustomBundlesService]
})
export class CustomBundlesModule {}
