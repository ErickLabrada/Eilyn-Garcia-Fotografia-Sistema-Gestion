import { Module } from '@nestjs/common';
import { SaleBundlesController } from './sale-bundles.controller';
import { SaleBundlesService } from './sale-bundles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaleBundle } from 'src/Domain/sale.bundle.entity';
import { AppointmentTemplate } from 'src/Domain/appointment.template.entity';
import { Contract } from 'src/Domain/contract.entity';
import { Item } from 'src/Domain/item.entity';
import { Event } from 'src/Domain/event.entity';

@Module({
  imports:[TypeOrmModule.forFeature([SaleBundle,AppointmentTemplate,Contract,Item,Event])],
  controllers: [SaleBundlesController],
  providers: [SaleBundlesService]
})
export class SaleBundlesModule {}
