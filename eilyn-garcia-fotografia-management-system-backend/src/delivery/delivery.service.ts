import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Delivery } from 'src/Domain/delivery.entity';
import { DeliveryType } from 'src/Domain/delivery.type.entity';
import { Employee } from 'src/Domain/employee.entity';
import { CreateDeliveryDTO } from 'src/dtos/deliveryDto/create-delivery.dto';
import { UpdateDeliveryDTO } from 'src/dtos/deliveryDto/update-delivery,dto';
import { Repository} from "typeorm"

@Injectable()
export class DeliveryService {
    constructor(
        @InjectRepository(Delivery) private deliveryRepository: Repository<Delivery>,
        @InjectRepository(DeliveryType) private deliveryTypeRepository: Repository<DeliveryType>,
        @InjectRepository(Employee) private employeeRepository: Repository<Employee>,
    ){}
    async createDelivery(deliveryDto: CreateDeliveryDTO) {
        const { deliveryType, employeeId, ...deliveryData } = deliveryDto;

        const deliveryTypeEntity = await this.deliveryTypeRepository.findOne({
            where: {
                type: deliveryType,
            },
        });

        const employeeEntity = await this.employeeRepository.findOne({
            where: {
                id: employeeId,
            },
        });



        const newDelivery = this.deliveryRepository.create({
            ...deliveryData,
            deliveryType: deliveryTypeEntity,
            employee: employeeEntity, 
        });

        return this.deliveryRepository.save(newDelivery);
    }

    async getDeliverys(){
        return await this.deliveryRepository.find()
    }

    async getDelivery(id: number){
        return await this.deliveryRepository.findOne({
            where:{
                id
            }
        })
    }

    async updateDelivery(id: number, deliveryDTO: UpdateDeliveryDTO){
        return await this.deliveryRepository.update({id}, deliveryDTO)
    }

    async deleteDelivery(id: number){
        return await this.deliveryRepository.delete({id})
    }
}