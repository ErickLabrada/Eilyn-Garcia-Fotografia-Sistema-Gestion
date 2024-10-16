import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from 'src/Domain/employee.entity';
import { Rol } from 'src/Domain/rol.entity';
import { Repository, In } from 'typeorm';
import { CreateEmployeeDto } from 'src/dtos/employeeDtos/create-employee.dto';
import { RolesEnum } from 'src/Domain/enums/rol.enum';
import { UpdateEmployeeDto } from 'src/dtos/employeeDtos/update-employee.dto';

@Injectable()
export class EmployeesService {

    constructor(
        @InjectRepository(Employee) private employeeRepository: Repository<Employee>,
        @InjectRepository(Rol) private rolRepository: Repository<Rol>
    ) {}

    async createEmployee(employeeDto: CreateEmployeeDto) {
        const { roles, ...employeeData } = employeeDto;

        const roleEntities = await this.rolRepository.find({
            where: {
                rol: In(roles)  
            }
        });

        const newEmployee = this.employeeRepository.create({
            ...employeeData,
            roles: roleEntities,
        });

        return await this.employeeRepository.save(newEmployee);
    }

    async getEmployees(){
        return await this.employeeRepository.find()
    }

    async getEmployee(id: number){
        return await this.employeeRepository.findOne({
            where:{
                id
            }
        })
    }

    async updateEmployee(id: number, employeeDTO: UpdateEmployeeDto){
        return await this.employeeRepository.update({id}, employeeDTO)
    }

    async deleteEmployee(id: number){
        return await this.employeeRepository.delete({id})
    }

}