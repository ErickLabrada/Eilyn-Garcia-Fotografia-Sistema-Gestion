import { Module } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from 'src/Domain/delivery.entity';
import { DeliveryController } from './delivery.controller';
import { DeliveryType } from 'src/Domain/delivery.type.entity';
import { Employee } from 'src/Domain/employee.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Delivery,DeliveryType,Employee])],
  providers: [DeliveryService],
  controllers: [DeliveryController],
})
export class DeliveryModule {}
