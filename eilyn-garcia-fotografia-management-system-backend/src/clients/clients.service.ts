import {  BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/Domain/client.entity';
import { Contract } from 'src/Domain/contract.entity';
import { CreateClientDTO } from 'src/dtos/clientdto/create-client.dto';
import { UpdateClientDTO } from 'src/dtos/clientdto/update-client.dto';
import {In, Repository} from "typeorm"

@Injectable()
export class ClientsService {
    constructor(
        @InjectRepository(Client) private clientRepo: Repository<Client>,
        @InjectRepository(Client) private clientRepository: Repository<Client>,
        @InjectRepository(Contract) private contractRepository: Repository<Contract>
    ){}

    async createClient(clientDTO: CreateClientDTO) {
        const { contractsID, ...clientData } = clientDTO;
    
        // Validate the phone property (this is optional but good for clarity)
        if (!clientData.phone) {
            throw new Error("Phone number is required");
        }
    
        // Check if contractsID is provided and is an array
        const contractsEntities = Array.isArray(contractsID) && contractsID.length > 0 
            ? await this.contractRepository.find({
                where: {
                    id: In(contractsID)
                }
            }) 
            : [];
    
        const newClient = this.clientRepository.create({
            ...clientData,
            contracts: contractsEntities
        });
    
        return await this.clientRepository.save(newClient);
    }
    

    async getClients(){
        return await this.clientRepository.find()
    }

    async getClient(id: number){
        return await this.clientRepository.findOne({
            where:{
                id
            }
        })
    }

    async getClientByPhone(phone: string){
        return await this.clientRepository.findOne({
            where:{
                phone
            }
        })
    }

    async updateClients(id: number, clientDTO: UpdateClientDTO){
        return await this.clientRepository.update({id}, clientDTO)
    }

    async deleteClient(id: number){
        return await this.clientRepository.delete({id})
    }

    async getClientsWithActiveAppointments(): Promise<Client[]> {
    try {
      return await this.clientRepo
        .createQueryBuilder('client')
        .leftJoinAndSelect('client.contracts', 'contract')
        .leftJoinAndSelect('contract.status', 'status')
        .leftJoinAndSelect('contract.appointments', 'appointment')
        .where('status.id IN (:...statuses)', { statuses: [1, 2] })
        .andWhere('appointment.id IS NOT NULL')
        .getMany();
    } catch (err) {
      console.error('Error loading clients with appointments', err);
      throw new Error('No se pudieron obtener los clientes');
    }
  }

}
