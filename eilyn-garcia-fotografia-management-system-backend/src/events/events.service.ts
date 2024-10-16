import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bundle } from 'src/Domain/bundle.entity';
import { Contract } from 'src/Domain/contract.entity';
import { EventsEnum } from 'src/Domain/enums/events.enum';
import { Event } from 'src/Domain/event.entity';
import { CreateEventDTO } from 'src/dtos/eventsdto/create-event.dto';
import { UpdateEventDTO } from 'src/dtos/eventsdto/update-event.dto';
import {In, Repository} from "typeorm"
@Injectable()
export class EventsService {

    constructor(
        @InjectRepository(Event) private eventRepository: Repository<Event>,
        @InjectRepository(Bundle) private bundleRepository: Repository<Bundle>,
        @InjectRepository(Contract) private contractRepository: Repository<Contract>

    ){}

    async createEventRepository(eventDTO: CreateEventDTO){
        const {bundlesId, contractsID,...EventData}=eventDTO;

        const bundleEntities=await this.bundleRepository.find({
            where:{
                id:In (bundlesId)
            }
        })

        const contractEntities=await this.contractRepository.find({
            where:{
                id:In(contractsID)
            }
        })

        const newEvent=await this.eventRepository.create({
            ...EventData,
            bundles: bundleEntities,
            contracts:contractEntities
        })
        return await this.eventRepository.save(newEvent)

    }

    async getEvents(){
        return await this.eventRepository.find()
    }

    async getEvent(id: number){
        return await this.eventRepository.findOne({
            where:{
                id
            }
        })
    }

    async updateEvent(id: number, eventDTO: UpdateEventDTO){
        return await this.eventRepository.update({id}, eventDTO)
    }

    async deleteEvent(id: number){
        return await this.eventRepository.delete({id})
    }

    async getEventByName(event: EventsEnum) {
        return await this.eventRepository.findOne({ where: { event: event } });
    }
    
}
 