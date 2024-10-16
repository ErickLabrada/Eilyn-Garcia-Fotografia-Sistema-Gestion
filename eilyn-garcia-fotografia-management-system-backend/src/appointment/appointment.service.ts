import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/Domain/appointment.entity';
import { Bundle } from 'src/Domain/bundle.entity';
import { Contract } from 'src/Domain/contract.entity';
import { Employee } from 'src/Domain/employee.entity';
import { CreateAppointmentDTO } from 'src/dtos/appointmentsDTO/create-appointment.dto';
import { UpdateAppointmentDTO } from 'src/dtos/appointmentsDTO/update-appointment.dto';
import { Repository } from "typeorm"
@Injectable()
export class AppointmentService {

    constructor(
        @InjectRepository(Appointment) private appointmentRepository: Repository<Appointment>,
        @InjectRepository(Employee) private employeeRepository: Repository<Employee>,
        @InjectRepository(Contract) private contractRepository: Repository<Contract>,
        @InjectRepository(Bundle) private bundleRepository: Repository<Bundle>,

    ){}

    async createAppointment(appointmentDTO: CreateAppointmentDTO){

        const {bundleId,employeeID,contractID,...appointmentData}= appointmentDTO;

        const bundleEntity = await this.bundleRepository.findOneBy({
            id: (bundleId)
        })

        const employeeEntity = await this.employeeRepository.findOneBy({
            id: (employeeID)
        })

        const contractEntity = await this.contractRepository.findOneBy({
            id: (contractID)
        })

        const newAppointment=this.appointmentRepository.create({
            ...appointmentData,
            bundle: bundleEntity,
            employee: employeeEntity,
            contract: contractEntity
        })
        return await this.appointmentRepository.save(newAppointment)
    }

    async getAppointments(){
        return await this.appointmentRepository.find()
    }

    async getAppointment(id: number){
        return await this.appointmentRepository.findOne({
            where:{
                id
            }
        })
    }

    async updateAppointment(id: number, appointmentDTO: UpdateAppointmentDTO){
        return await this.appointmentRepository.update({id}, appointmentDTO)
    }

    async deleteAppointment(id: number){
        return await this.appointmentRepository.delete({id})
    }

}