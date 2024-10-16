import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentTemplate } from 'src/Domain/appointment.template.entity';
import { Bundle } from 'src/Domain/bundle.entity';
import { CreateAppointmentTemplateDTO } from 'src/dtos/appointment-template.dto.ts/create-appointment-template.dto';
import { UpdateAppointmentTemplateDTO } from 'src/dtos/appointment-template.dto.ts/update-appointment-tamplate.dto';
import {Repository} from "typeorm"

@Injectable()
export class AppointmentTemplateService {

    constructor(
        @InjectRepository(AppointmentTemplate)private appointmentTemplateRepository: Repository<AppointmentTemplate>,
        @InjectRepository(Bundle) private bundleRepository: Repository<Bundle>
    ){}

    async createAppointmentTemplate(appointmentTemplateDTO: CreateAppointmentTemplateDTO){

        const{bundleId,...AppointmentTemplateData}=appointmentTemplateDTO;

        const bundleEntity = await this.bundleRepository.findOneBy({
            id: (bundleId)
        })



        const newAppointmentTemplate= this.appointmentTemplateRepository.create({
            ...AppointmentTemplateData,
            bundle: bundleEntity,
        }
        )
        return await this.appointmentTemplateRepository.save(newAppointmentTemplate)

    }

    
    async getAppointmentTemplates(){
        return await this.appointmentTemplateRepository.find()
    }

    async getAppointmentTemplate(id: number){
        return await this.appointmentTemplateRepository.findOne({
            where:{
                id
            }
        })
    }

    async updateAppointmentTemplate(id: number, appointmentDTO: UpdateAppointmentTemplateDTO){
        return await this.appointmentTemplateRepository.update({id}, appointmentDTO)
    }

    async deleteAppointmentTemplate(id: number){
        return await this.appointmentTemplateRepository.delete({id})
    }

}
