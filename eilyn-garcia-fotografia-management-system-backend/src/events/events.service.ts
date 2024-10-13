import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bundle } from 'src/Domain/bundle.entity';
import { Contract } from 'src/Domain/contract.entity';
import { Event } from 'src/Domain/event.entity';
import { CreateEventDTO } from 'src/dtos/eventsdto/create-event.dto';
import {In, Repository} from "typeorm"
@Injectable()
export class EventsService {

    constructor(
        @InjectRepository(Event) private eventRepository: Repository<Event>,
        @InjectRepository(Bundle) private bundleRepository: Repository<Bundle>,
        @InjectRepository(Contract) private contractRepository: Repository<Contract>

    ){}

    async createEventRepository(eventDTO: CreateEventDTO){
        const {bundleId, contractsID,...EventData}=eventDTO;

        const bundleEntity=await this.bundleRepository.findOne({
            where:{
                id: bundleId
            }
        })

        const contractEntities=await this.contractRepository.find({
            where:{
                id:In(contractsID)
            }
        })

        const newEvent=await this.eventRepository.create({
            ...EventData,
            bundle: bundleEntity,
            contracts:contractEntities
        })
        return await this.eventRepository.save(newEvent)

    }

}
 