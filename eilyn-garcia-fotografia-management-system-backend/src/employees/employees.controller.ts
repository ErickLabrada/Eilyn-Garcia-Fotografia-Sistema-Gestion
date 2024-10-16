import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from 'src/dtos/employeeDtos/create-employee.dto';
import { Employee } from 'src/Domain/employee.entity';
import { UpdateEmployeeDto } from 'src/dtos/employeeDtos/update-employee.dto';
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

    @Get()
    getEmployees():Promise<Employee[]>{
        return this.employeesService.getEmployees()
    }

    @Get(":id")
    getEmployee(@Param("id",ParseIntPipe)id: number):Promise <Employee>{
        return this.employeesService.getEmployee(id)
    }

    @Patch(":id")
    updateEmployee(@Param("id",ParseIntPipe)id:number, @Body()employeeDTO: UpdateEmployeeDto){
        this.employeesService.updateEmployee(id, employeeDTO)
    }

    @Delete(":id")
    deleteEmployee(@Param("id", ParseIntPipe)id: number){
        return this.employeesService.deleteEmployee(id)
    }

}
