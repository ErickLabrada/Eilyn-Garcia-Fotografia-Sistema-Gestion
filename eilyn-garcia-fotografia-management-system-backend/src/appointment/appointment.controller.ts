import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDTO } from 'src/dtos/appointmentsDTO/create-appointment.dto';
import { Appointment } from 'src/Domain/appointment.entity';
import { UpdateAppointmentDTO } from 'src/dtos/appointmentsDTO/update-appointment.dto';

@Controller('appointment')
export class AppointmentController {

    constructor(private appointmentService: AppointmentService){

    }

    @Post()
    createAppointment(@Body() appointmentDTO: CreateAppointmentDTO){
        this.appointmentService.createAppointment(appointmentDTO);
    }

    @Get()
    getAppointments():Promise<Appointment[]>{
        return this.appointmentService.getAppointments()
    }

    @Get(":id")
    getAppointment(@Param("id",ParseIntPipe)id: number):Promise <Appointment>{
        return this.appointmentService.getAppointment(id)
    }

    @Patch(":id")
    updateAppointment(@Param("id",ParseIntPipe)id:number, @Body()appointmentDTO: UpdateAppointmentDTO){
        this.appointmentService.updateAppointment(id, appointmentDTO)
    }

    @Delete(":id")
    deleteAppointment(@Param("id", ParseIntPipe)id: number){
        return this.appointmentService.deleteAppointment(id)
    }

}
