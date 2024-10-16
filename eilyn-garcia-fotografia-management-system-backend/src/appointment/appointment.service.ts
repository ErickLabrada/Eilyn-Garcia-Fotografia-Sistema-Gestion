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

    async createAppointment(appointmentDTO: CreateAppointmentDTO) {
        const { bundleId, employeeID, contractID, ...appointmentData } = appointmentDTO;
    
        // Fetch the related entities and log them
        const bundleEntity = await this.bundleRepository.findOneBy({ id: bundleId });
        const employeeEntity = await this.employeeRepository.findOneBy({ id: employeeID });
        const contractEntity = await this.contractRepository.findOneBy({ id: contractID });
    
        // Check if the entities are found
        if (!bundleEntity) {
            console.error('Bundle not found with ID:', bundleId);
            throw new Error('Bundle not found.');
        }
        if (employeeID && !employeeEntity) {
            console.error('Employee not found with ID:', employeeID);
            throw new Error('Employee not found.');
        }
        if (contractID && !contractEntity) {
            console.error('Contract not found with ID:', contractID);
            throw new Error('Contract not found.');
        }
    
        const newAppointment = this.appointmentRepository.create({
            ...appointmentData,
            bundle: bundleEntity,
            employee: employeeEntity,
            contract: contractEntity
        });
    
        try {
            const savedAppointment = await this.appointmentRepository.save(newAppointment);
            console.log('Appointment saved:', savedAppointment);
            return savedAppointment;  // Return the saved appointment
        } catch (error) {
            console.error('Error saving appointment:', error);
            throw new Error('Failed to create appointment. Please try again later.');
        }
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