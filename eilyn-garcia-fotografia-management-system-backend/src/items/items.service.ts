import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bundle } from 'src/Domain/bundle.entity';
import { Item } from 'src/Domain/item.entity';
import { Provider } from 'src/Domain/provider.entity';
import { CreateItemDTO } from 'src/dtos/itemsDTO/create-item.dto';
import { UpdateItemDTO } from 'src/dtos/itemsDTO/update-item.dto';
import {In, Repository} from "typeorm"

@Injectable()
export class ItemsService {
    constructor(
        @InjectRepository(Item) private itemRepository: Repository<Item>,
        @InjectRepository(Provider) private providerRepository: Repository<Provider>,
        @InjectRepository(Bundle) private bundleRepository: Repository<Bundle>

    ){}

    async createItem(itemDTO: CreateItemDTO){
        
        const {providerID,bundlesID,...itemData}=itemDTO

        const providerEntity = await this.providerRepository.findOne({
            where:{
                id: providerID
            }
        })
        const bundlesEntity= await this.bundleRepository.find({
            where:{
                id: In(bundlesID)
            }
        })

        const newItem=await this.itemRepository.create({
            ...itemData,
            provider: providerEntity,
            bundles: bundlesEntity
        })
        return await this.itemRepository.save(newItem)

    }

    async getItems(){
        return await this.itemRepository.find()
    }

    async getItem(id: number){
        return await this.itemRepository.findOne({
            where:{
                id
            }
        })
    }

    async updateItem(id: number, itemDTO: UpdateItemDTO){
        return await this.itemRepository.update({id}, itemDTO)
    }

    async deleteItem(id: number){
        return await this.itemRepository.delete({id})
    }
}
