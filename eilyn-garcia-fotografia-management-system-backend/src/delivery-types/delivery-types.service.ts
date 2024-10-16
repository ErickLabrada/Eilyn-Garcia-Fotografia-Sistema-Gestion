import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryType } from 'src/Domain/delivery.type.entity';
import { CreateDeliveryTypeDto } from 'src/dtos/delivery-type-dto/create-delivery-type.dto';
import { UpdateDeliveryTypeDto } from 'src/dtos/delivery-type-dto/update-delivery-type.dto';
import {Repository} from "typeorm"

@Injectable()
export class DeliveryTypesService {
    constructor(@InjectRepository(DeliveryType) private deliveryTypeRepository: Repository<DeliveryType>){

    }

    async createDeliveryType(createDeliveryTypeDto: CreateDeliveryTypeDto) {
        const newDeliveryType = this.deliveryTypeRepository.create({
            type: createDeliveryTypeDto.deliveryType, 
            deliverys: createDeliveryTypeDto.deliverys,
        });
        return await this.deliveryTypeRepository.save(newDeliveryType);
    }

    async getDeliveryTypes(){
        return await this.deliveryTypeRepository.find()
    }

    async getDeliveryType(id: number){
        return await this.deliveryTypeRepository.findOne({
            where:{
                id
            }
        })
    }
    async deleteDeliveryType(id: number){
        return await this.deliveryTypeRepository.delete({id})
    }

}