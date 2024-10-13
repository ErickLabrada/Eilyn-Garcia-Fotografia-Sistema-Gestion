import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentTemplate } from 'src/Domain/appointment.template.entity';
import { Bundle } from 'src/Domain/bundle.entity';
import { Employee } from 'src/Domain/employee.entity';
import { Item } from 'src/Domain/item.entity';
import { CreateBundleDTO } from 'src/dtos/bundleDtos/create-bundle.dto';
import {Repository} from "typeorm"

@Injectable()
export class BundleService {

    constructor(
        @InjectRepository(Bundle) private bundleRepository: Repository<Bundle>,
        @InjectRepository(AppointmentTemplate) private appointmentTemplateRepository: Repository<AppointmentTemplate>

){}

    async createBundle(bundleDTO: CreateBundleDTO){

        const {appointmentTemplateID, ...bundleData } = bundleDTO;

        const appointmentTemplateEntity = await this.appointmentTemplateRepository.find({
            where: {
                id: appointmentTemplateID,
            },
        });

        const newBundle = this.bundleRepository.create({
            ...bundleData,
            appointmentTemplates: appointmentTemplateEntity,
        });

        this.bundleRepository.save(newBundle);

    }

}
