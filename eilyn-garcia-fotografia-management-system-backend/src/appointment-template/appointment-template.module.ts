import { Module } from '@nestjs/common';
import { AppointmentTemplateController } from './appointment-template.controller';
import { AppointmentTemplateService } from './appointment-template.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentTemplate } from 'src/Domain/appointment.template.entity';
import { Bundle } from 'src/Domain/bundle.entity';

@Module({
  imports:[TypeOrmModule.forFeature([AppointmentTemplate,Bundle])],
  controllers: [AppointmentTemplateController],
  providers: [AppointmentTemplateService]
})
export class AppointmentTemplateModule {}
