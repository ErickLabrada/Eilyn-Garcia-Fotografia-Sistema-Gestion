import { Body, Controller, Post } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDTO } from 'src/dtos/appointmentsDTO/create-appointment.dto';

@Controller('appointment')
export class AppointmentController {

    constructor(private appointmentService: AppointmentService){

    }

    @Post()
    createAppointment(@Body() appointmentDTO: CreateAppointmentDTO){
        this.appointmentService.createAppointment(appointmentDTO);
    }

}
