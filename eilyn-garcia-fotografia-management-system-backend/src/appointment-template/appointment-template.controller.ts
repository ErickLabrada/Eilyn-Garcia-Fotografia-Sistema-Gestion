import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateAppointmentTemplateDTO } from 'src/dtos/appointment-template.dto.ts/create-appointment-template.dto';
import { AppointmentTemplateService } from './appointment-template.service';
import { AppointmentTemplate } from 'src/Domain/appointment.template.entity';
import { UpdateAppointmentTemplateDTO } from 'src/dtos/appointment-template.dto.ts/update-appointment-tamplate.dto';

@Controller('appointment-template')
export class AppointmentTemplateController {

    constructor(
        private appointmentTemplateService: AppointmentTemplateService
    ){}

    @Post()
    createAppointmentTemplate(@Body() newAppointmentTemplate: CreateAppointmentTemplateDTO){
        this.appointmentTemplateService.createAppointmentTemplate(newAppointmentTemplate)
    }

    
    @Get()
    getAppointmentTemplates():Promise<AppointmentTemplate[]>{
        return this.appointmentTemplateService.getAppointmentTemplates()
    }

    @Get(":id")
    getAppointmentTemplate(@Param("id",ParseIntPipe)id: number):Promise <AppointmentTemplate>{
        return this.appointmentTemplateService.getAppointmentTemplate(id)
    }

    @Patch(":id")
    updateAppointmentTemplate(@Param("id",ParseIntPipe)id:number, @Body()appointmentDTO: UpdateAppointmentTemplateDTO){
        this.appointmentTemplateService.updateAppointmentTemplate(id, appointmentDTO)
    }

    @Delete(":id")
    deleteAppointmentTemplate(@Param("id", ParseIntPipe)id: number){
        return this.appointmentTemplateService.deleteAppointmentTemplate(id)
    }

}
