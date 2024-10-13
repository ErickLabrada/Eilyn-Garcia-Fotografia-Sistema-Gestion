import { Module } from '@nestjs/common';
import { DeliveryTypesService } from './delivery-types.service';
import { DeliveryTypesController } from './delivery-types.controller';
import { DeliveryType } from 'src/Domain/delivery.type.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([DeliveryType])],
  providers: [DeliveryTypesService],
  controllers: [DeliveryTypesController]
})
export class DeliveryTypesModule {}
