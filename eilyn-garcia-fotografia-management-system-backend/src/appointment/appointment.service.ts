import { Body, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/Domain/appointment.entity';
import { Bundle } from 'src/Domain/bundle.entity';
import { Contract } from 'src/Domain/contract.entity';
import { Employee } from 'src/Domain/employee.entity';
import { CreateAppointmentDTO } from 'src/dtos/appointmentsDTO/create-appointment.dto';
import { GetUnavailableHoursDTO } from 'src/dtos/appointmentsDTO/get-unavailable-dates.dto';
import { UpdateAppointmentDTO } from 'src/dtos/appointmentsDTO/update-appointment.dto';
import { Between, Repository } from "typeorm"
import { StatusEnum } from 'src/Domain/enums/status.enum';
import { Status } from 'src/Domain/status.entity';
import { ReportAppointmentDTO } from 'src/dtos/appointmentsDTO/report-appointment.dto';
import { report } from 'process';
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
        return await this.appointmentRepository.find({relations: ['bundle','contract',  'contract.client','contract.status']})
    }

    async getAppointmentsByDate(targetDate: Date) {
        const allAppointments = await this.getAppointments();
        const targetDay = targetDate.toDateString(); // Convert to a string to ignore time
    
        const appointmentsForDay = allAppointments.filter(appointment => {
            return appointment.date.toDateString() === targetDay;
        });
    
        return appointmentsForDay;
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

    async getUnavailableHours(date: Date) {
        const unavailableDates = await  this.getAppointmentsByDate(date)
        let unavailableHours: GetUnavailableHoursDTO[] = [];
    
        for (const appointment of unavailableDates) {
            const startDate = appointment.date;
            const endDate = new Date(startDate);
            endDate.setHours(endDate.getHours() + appointment.hours); 
    
            const unavailableDate = new GetUnavailableHoursDTO();
            unavailableDate.startDate = startDate;
            unavailableDate.endDate = endDate;
    
            unavailableHours.push(unavailableDate);
        }

        return unavailableHours;
    }


    async confirmAppointment(id: number): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findOne({ where: { id }, relations: ['contract','contract.status'] });
    
        if (!appointment) {
            throw new Error('Appointment not found.');
        }
    
     
        appointment.contract.status.id = 2;
    
        try {
            await this.contractRepository.save(appointment.contract);
            return appointment;
        } catch (error) {
            console.error('Error confirming appointment:', error);
            throw new Error('Failed to confirm appointment.');
        }
    }

    async cancelAppointment(id: number): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findOne({ where: { id }, relations: ['contract','contract.status'] });
    
        if (!appointment) {
            throw new Error('Appointment not found.');
        }
    
   

        appointment.contract.status.id = 3;
    
        try {
            await this.contractRepository.save(appointment.contract);
            return appointment;
        } catch (error) {
            console.error('Error cancelled appointment:', error);
            throw new Error('Failed to cancelled appointment.');
        }
    }

    async getAppointmentsReport(reportAppointmentDTO: ReportAppointmentDTO) {
        try {
            const appointments = await this.appointmentRepository.find({
                where: {
                    date: Between(new Date(reportAppointmentDTO.startDate), new Date(reportAppointmentDTO.endDate)),
                    bundle: { id: reportAppointmentDTO.bundleId },
                },
                relations: ['bundle', 'contract', 'contract.client', 'contract.status'],
                select: ['date', 'bundle', 'place', 'description'],
            });


            console.log('Appointments found:', appointments);
            

            return appointments;
        } catch (error) {
            console.error('Error al obtener citas:', error);
            throw new Error('No se pudo obtener las citas');
        }
    }

}