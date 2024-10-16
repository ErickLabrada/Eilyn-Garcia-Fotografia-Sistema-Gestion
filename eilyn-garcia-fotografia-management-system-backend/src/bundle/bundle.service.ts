import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AppointmentTemplate } from 'src/Domain/appointment.template.entity';
import { Bundle } from 'src/Domain/bundle.entity';
import { Contract } from 'src/Domain/contract.entity';
import { Employee } from 'src/Domain/employee.entity';
import { EventsEnum } from 'src/Domain/enums/events.enum';
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

    async getBundlesByEventType(eventType: EventsEnum) {
        return await this.bundleRepository
            .createQueryBuilder('bundle')
            .innerJoinAndSelect('bundle.events', 'event')
            .where('event.event = :eventType', { eventType })
            .getMany();
    }

    async getBundleByName(name: string): Promise<Bundle> {
        try {
            // Query to find bundles by name
            const bundle = await this.bundleRepository.findOne({
                where: { name } // Adjust the field name based on your entity definition
            });

            return bundle;
        } catch (error) {
            // Handle errors (you might want to log the error or throw a custom exception)
            console.error('Error fetching bundle:', error);
            throw new Error('Could not fetch bundles. Please try again later.');
        }
    }
    

}