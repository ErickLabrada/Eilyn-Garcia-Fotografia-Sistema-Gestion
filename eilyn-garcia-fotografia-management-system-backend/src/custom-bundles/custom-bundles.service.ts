import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentTemplate } from 'src/Domain/appointment.template.entity';
import { Bundle } from 'src/Domain/bundle.entity';
import { Contract } from 'src/Domain/contract.entity';
import { CustomBundle } from 'src/Domain/custom.bundle.entity';
import { Event } from 'src/Domain/event.entity';
import { Item } from 'src/Domain/item.entity';
import { CreateCustomBundleDTO } from 'src/dtos/custom-bundle-dto/create-custom-bundle.dto';
import { UpdateCustomBundleDTO } from 'src/dtos/custom-bundle-dto/update-custom-bundle.dto';
import {In, Repository} from "typeorm"


@Injectable()
export class CustomBundlesService {constructor(
    @InjectRepository(CustomBundle) private customBundleRepository: Repository<CustomBundle>,
    @InjectRepository(AppointmentTemplate) private appointmentTemplateRepository: Repository<AppointmentTemplate>,
    @InjectRepository(Contract) private contractRepository: Repository<Contract>,
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    @InjectRepository(Event) private eventRepository: Repository<Event>,
){}

async createCustomBundle(bundleDTO: CreateCustomBundleDTO){

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

    const newBundle = this.customBundleRepository.create({
        ...bundleData,
        contracts:contractEntities,
        items:itemEntities,
        events:eventEntities,
        appointmentTemplates: appointmentTemplateEntity,
    });
    this.customBundleRepository.save(newBundle);
}
async getCustomBundles(){
    return await this.customBundleRepository.find()
}

async getCustomBundle(id: number){
    return await this.customBundleRepository.findOne({
        where:{
            id
        }
    })
}

async updateCustomBundle(id: number, customBundleDTO: UpdateCustomBundleDTO){
    return await this.customBundleRepository.update({id}, customBundleDTO)
}

async deleteCustomBundle(id: number){
    return await this.customBundleRepository.delete({id})
}
}
