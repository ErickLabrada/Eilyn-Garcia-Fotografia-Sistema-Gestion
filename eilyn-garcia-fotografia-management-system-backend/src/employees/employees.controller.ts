import { Body, Controller, Post } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from 'src/dtos/employeeDtos/create-employee.dto';
@Controller('employees')
export class EmployeesController {


    constructor(
        private employeesService: EmployeesService
    ){
    }

    @Post()
    createEmployee(@Body() newEmployee: CreateEmployeeDto){
        this.employeesService.createEmployee(newEmployee)
    }

}
