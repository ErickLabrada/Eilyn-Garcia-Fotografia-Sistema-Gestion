import { Module } from '@nestjs/common';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/Domain/appointment.entity';
import { Employee } from 'src/Domain/employee.entity';
import { Contract } from 'src/Domain/contract.entity';
import { Bundle } from 'src/Domain/bundle.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Appointment, Employee, Contract,Bundle])],
  controllers: [AppointmentController],
  providers: [AppointmentService]
})
export class AppointmentModule {}
