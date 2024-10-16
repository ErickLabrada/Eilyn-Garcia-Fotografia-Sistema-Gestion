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
import { UpdateContractDTO } from 'src/dtos/contractsDtos/update-contracts.dto';
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


    async createContract(contractDTO: CreateContractDTO) {
        const {
            appointmentsID = [],
            deliverysID = [],
            bundleID,
            clientID,
            eventID,
            statusID,
            ...contractData
        } = contractDTO;
    
        try {
            // Validate required fields
            if (!clientID) {
                throw new Error('Client ID is required.');
            }
    
            // Fetching related entities
            const appointmentEntities = await this.appointmentRepository.find({
                where: {
                    id: In(appointmentsID), // Ensure this is an array
                },
            });
    
            const deliveryEntities = await this.deliveryRepository.find({
                where: {
                    id: In(deliverysID), // Ensure this is an array
                },
            });
    
            const [bundleEntity, clientEntity, eventEntity, statusEntity] = await Promise.all([
                bundleID ? this.bundleRepository.findOne({ where: { id: bundleID } }) : null,
                this.clientRepository.findOne({ where: { id: clientID } }),
                eventID ? this.eventRepository.findOne({ where: { id: eventID } }) : null,
                statusID ? this.statusRepository.findOne({ where: { id: statusID } }) : null,
            ]);
    
            // Check if mandatory entities exist
            if (!clientEntity) {
                throw new Error(`Client with ID ${clientID} not found.`);
            }
    
            // Creating a new contract entity
            const newContract = this.contractRepository.create({
                ...contractData,
                appointments: appointmentEntities,
                deliverys: deliveryEntities,
                bundle: bundleEntity,
                client: clientEntity,
                event: eventEntity,
                status: statusEntity,
            });
    
            // Saving the new contract to the database
            return await this.contractRepository.save(newContract);
        } catch (error) {
            console.error('Error creating contract:', error.message);
            throw new Error('Failed to create contract. Please try again later.');
        }
    }
    
    
    async getContracts(){
        return await this.contractRepository.find()
    }

    async getContract(id: number){
        return await this.contractRepository.findOne({
            where:{
                id
            }
        })
    }

    async updateContract(id: number, contractDTO: UpdateContractDTO){
        return await this.contractRepository.update({id}, contractDTO)
    }

    async deleteContract(id: number){
        return await this.contractRepository.delete({id})
    }


}
