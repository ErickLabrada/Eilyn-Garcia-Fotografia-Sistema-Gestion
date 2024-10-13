import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/Domain/employee.entity';
import { Rol } from 'src/Domain/rol.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Employee,Rol])],
  controllers: [EmployeesController],
  providers: [EmployeesService]
})
export class EmployeesModule {}
