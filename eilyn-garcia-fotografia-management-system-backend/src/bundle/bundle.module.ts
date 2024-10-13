import { Module } from '@nestjs/common';
import { BundleController } from './bundle.controller';
import { BundleService } from './bundle.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bundle } from 'src/Domain/bundle.entity';
import { AppointmentTemplate } from 'src/Domain/appointment.template.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Bundle,AppointmentTemplate])],
  controllers: [BundleController],
  providers: [BundleService]
})
export class BundleModule {}
