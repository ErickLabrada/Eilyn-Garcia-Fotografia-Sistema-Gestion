import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentTemplate } from 'src/Domain/appointment.template.entity';
import { Contract } from 'src/Domain/contract.entity';
import { Event } from 'src/Domain/event.entity';
import { Item } from 'src/Domain/item.entity';
import { SaleBundle } from 'src/Domain/sale.bundle.entity';
import { CreateSaleBundleDTO } from 'src/dtos/sale-bundle-dtos/create-sale-bundle.dto';
import { UpdateSaleBundleDTO } from 'src/dtos/sale-bundle-dtos/update-sale-bundle.dto';
import {In, Repository} from "typeorm"

@Injectable()
export class SaleBundlesService {

    constructor(
    @InjectRepository(SaleBundle) private saleBundleRepository: Repository<SaleBundle>,
    @InjectRepository(AppointmentTemplate) private appointmentTemplateRepository: Repository<AppointmentTemplate>,
    @InjectRepository(Contract) private contractRepository: Repository<Contract>,
    @InjectRepository(Item) private itemRepository: Repository<Item>,
    @InjectRepository(Event) private eventRepository: Repository<Event>,

){}

    async createSaleBundle(saleBundleDTO: CreateSaleBundleDTO){

        const {contractsId,
            itemsID,
            eventsID,
            appointmentTemplateID,
            ...bundleData } = saleBundleDTO;

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

        const newSaleBundle = await this.saleBundleRepository.create({
            ...bundleData,
            contracts:contractEntities,
            items:itemEntities,
            events:eventEntities,
            appointmentTemplates: appointmentTemplateEntity,
        });

        return await this.saleBundleRepository.save(newSaleBundle);
        
    }

    async getSaleBundles(){
        return await this.saleBundleRepository.find()
    }

    async getSaleBundle(id: number){
        return await this.saleBundleRepository.findOne({
            where:{
                id
            }
        })
    }

    async updateSaleBundle(id: number, saleBundleDTO: UpdateSaleBundleDTO){
        return await this.saleBundleRepository.update({id}, saleBundleDTO)
    }

    async deleteSaleBundle(id: number){
        return await this.saleBundleRepository.delete({id})
    }

}