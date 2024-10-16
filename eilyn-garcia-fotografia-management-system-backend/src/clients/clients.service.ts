import {  Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/Domain/client.entity';
import { Contract } from 'src/Domain/contract.entity';
import { CreateClientDTO } from 'src/dtos/clientdto/create-client.dto';
import { UpdateClientDTO } from 'src/dtos/clientdto/update-client.dto';
import {In, Repository} from "typeorm"

@Injectable()
export class ClientsService {
    constructor(
        @InjectRepository(Client) private clientRepository: Repository<Client>,
        @InjectRepository(Contract) private contractRepository: Repository<Contract>
    ){}

    async createClient(clientDTO: CreateClientDTO){
        const {contractsID,...clientData}=clientDTO

        const contractsEntities= await this.contractRepository.find({
            where: {
                id: In(contractsID)  
            }
        })
        const newClient = this.clientRepository.create({
            ...clientData,
            contracts: contractsEntities
        });
        return await this.clientRepository.save(newClient)
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

    async updateClients(id: number, clientDTO: UpdateClientDTO){
        return await this.clientRepository.update({id}, clientDTO)
    }

    async deleteClient(id: number){
        return await this.clientRepository.delete({id})
    }
}
