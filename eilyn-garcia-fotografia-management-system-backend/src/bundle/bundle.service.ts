import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentTemplate } from 'src/Domain/appointment.template.entity';
import { Bundle } from 'src/Domain/bundle.entity';
import { Contract } from 'src/Domain/contract.entity';
import { Employee } from 'src/Domain/employee.entity';
import { Event } from 'src/Domain/event.entity';
import { Item } from 'src/Domain/item.entity';
import { CreateBundleDTO } from 'src/dtos/bundleDtos/create-bundle.dto';
import { UpdateBundleDTO } from 'src/dtos/bundleDtos/update-bundle.dto';
import {In, Repository} from "typeorm"

@Injectable()
export class BundleService {

    constructor(
        @InjectRepository(Bundle) private bundleRepository: Repository<Bundle>,
        @InjectRepository(AppointmentTemplate) private appointmentTemplateRepository: Repository<AppointmentTemplate>,
        @InjectRepository(Contract) private contractRepository: Repository<Contract>,
        @InjectRepository(Item) private itemRepository: Repository<Item>,
        @InjectRepository(Event) private eventRepository: Repository<Event>,
){}

    async createBundle(bundleDTO: CreateBundleDTO){

        const {contractsId,
            itemsID,
            eventsID,
            appointmentTemplateID,
            ...bundleData } = bundleDTO;

        const contractEntities = await this.contractRepository.find({
            where:{
                id:In(contractsId)
            }
        })
    
        const itemEntities = await this.itemRepository.find({
            where:{
                id:In(itemsID)
            }
        })
    
        const eventEntities = await this.eventRepository.find({
            where:{
                id: In(eventsID)
            }
        })
        
        const appointmentTemplateEntity = await this.appointmentTemplateRepository.find({
            where: {
                id: appointmentTemplateID,
            },
        });

        const newBundle = this.bundleRepository.create({
            ...bundleData,
            contracts:contractEntities,
            items:itemEntities,
            events:eventEntities,
            appointmentTemplates: appointmentTemplateEntity,
        });
        this.bundleRepository.save(newBundle);
    }

    async getBundles(){
        return await this.bundleRepository.find()
    }

    async getBundle(id: number){
        return await this.bundleRepository.findOne({
            where:{
                id
            }
        })
    }

    async updateBundle(id: number, bundleDTO: UpdateBundleDTO){
        return await this.bundleRepository.update({id}, bundleDTO)
    }

    async deleteBundle(id: number){
        return await this.bundleRepository.delete({id})
    }

    

}