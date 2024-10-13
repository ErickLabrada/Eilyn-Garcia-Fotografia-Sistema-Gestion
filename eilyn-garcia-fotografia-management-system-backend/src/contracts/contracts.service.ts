import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/Domain/appointment.entity';
import { Bundle } from 'src/Domain/bundle.entity';
import { Client } from 'src/Domain/client.entity';
import { Contract } from 'src/Domain/contract.entity';
import { Delivery } from 'src/Domain/delivery.entity';
import { Event } from 'src/Domain/event.entity';
import { Status } from 'src/Domain/status.entity';
import { CreateContractDTO } from 'src/dtos/contractsDtos/create-contract.dto';
import {In, Repository} from "typeorm"
@Injectable()
export class ContractsService {

    constructor(
      @InjectRepository(Contract) private contractRepository: Repository<Contract>,
      @InjectRepository(Appointment) private appointmentRepository: Repository<Appointment>,  
      @InjectRepository(Delivery) private deliveryRepository: Repository<Delivery>,  
      @InjectRepository(Bundle) private bundleRepository: Repository<Bundle>,  
      @InjectRepository(Client) private clientRepository: Repository<Client>,  
      @InjectRepository(Event) private eventRepository: Repository<Event>,  
      @InjectRepository(Status) private statusRepository: Repository<Status>  
    ){}


    async createContract(contractDTO: CreateContractDTO){
        const {
            appointmentsID,
            deliverysID,
            bundleID,
            clientID,
            eventID,
            statusID,
            ...contractData
        }= contractDTO

        const appointmentEntities= await this.appointmentRepository.find({
            where:{
                id: In(appointmentsID)
            }
        })

        const deliveryEntities = await this.deliveryRepository.find({
            where:{
                id: In(deliverysID)
            }
        })

        const bundleEntity = await this.bundleRepository.findOne({
            where:{
                id: bundleID
            }
        })

        const clientEntity = await this.clientRepository.findOne({
            where: {
                id: clientID
            }
        })

        const eventEntity = await this.eventRepository.findOne({
            where:{
                id: eventID
            }
        })

        const statusEntity = await this.statusRepository.findOne({
            where:{
                id: statusID
            }
        })

        const newContract = await this.contractRepository.create({
            ...contractData,
            appointments: appointmentEntities,
            deliverys: deliveryEntities,
            bundle: bundleEntity,
            client: clientEntity,
            event: eventEntity,
            status: statusEntity
        })

        return await this.contractRepository.save(newContract)
    }

}
