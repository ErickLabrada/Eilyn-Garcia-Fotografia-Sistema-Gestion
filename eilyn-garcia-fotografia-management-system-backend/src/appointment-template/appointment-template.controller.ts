import { Body, Controller, Post } from '@nestjs/common';
import { CreateAppointmentTemplateDTO } from 'src/dtos/appointment-template.dto.ts/create-appointment-template.dto';
import { AppointmentTemplateService } from './appointment-template.service';

@Controller('appointment-template')
export class AppointmentTemplateController {

    constructor(
        private appointmentTemplateService: AppointmentTemplateService
    ){}

    @Post()
    async createAppointmentTemplate(@Body() newAppointmentTemplate: CreateAppointmentTemplateDTO){
        this.appointmentTemplateService.createAppointmentTemplate(newAppointmentTemplate)
    }

}
