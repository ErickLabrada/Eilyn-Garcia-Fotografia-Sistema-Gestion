import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contract } from 'src/Domain/contract.entity';
import { Provider } from 'src/Domain/provider.entity';
import { CreateProviderDTO } from 'src/dtos/providerDto/create-provider.dto';
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
    }


