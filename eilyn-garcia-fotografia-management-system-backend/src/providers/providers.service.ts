import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contract } from 'src/Domain/contract.entity';
import { Provider } from 'src/Domain/provider.entity';
import { CreateProviderDTO } from 'src/dtos/providerDto/create-provider.dto';
import { UpdateProviderDTO } from 'src/dtos/providerDto/update-provider.dto';
import { In, Repository } from "typeorm"

@Injectable()
export class ProvidersService {

    constructor(
        @InjectRepository(Provider) private providerRepository: Repository<Provider>,
        @InjectRepository(Contract) private contractRepository: Repository<Contract>

    ){}

    async createProvider(phoneuserdto: CreateProviderDTO){
        const {itemsID,...providerData}=phoneuserdto
        const contractsEntities= await this.contractRepository.find({
            where: {
                id: In(itemsID)  
            }
        })
        const newProvider = this.providerRepository.create({
            ...providerData,
            items: contractsEntities
        });
        return await this.providerRepository.save(newProvider)
    }

    async getProviders(){
        return await this.providerRepository.find()
    }

    async getProvider(id: number){
        return await this.providerRepository.findOne({
            where:{
                id
            }
        })
    }

    async updateProvider(id: number, providerDTO: UpdateProviderDTO){
        return await this.providerRepository.update({id}, providerDTO)
    }

    async deleteProvider(id: number){
        return await this.providerRepository.delete({id})
    }

}