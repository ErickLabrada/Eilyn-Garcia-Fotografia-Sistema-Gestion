import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { DeliveryTypesService } from './delivery-types.service';
import { CreateDeliveryTypeDto } from 'src/dtos/delivery-type-dto/create-delivery-type.dto';
import { DeliveryType } from 'src/Domain/delivery.type.entity';
import { UpdateDeliveryTypeDto } from 'src/dtos/delivery-type-dto/update-delivery-type.dto';

@Controller('delivery-types')
export class DeliveryTypesController {
    constructor(
        private deliveryTypesService:DeliveryTypesService
    ){
        
    }

    @Post()
    async createDeliveryType(@Body() newDeliveryType: CreateDeliveryTypeDto) {
        console.log('Incoming delivery type:', newDeliveryType); // Log the incoming data
        return this.deliveryTypesService.createDeliveryType(newDeliveryType);
    }

    @Get()
    getDeliveryTypes():Promise<DeliveryType[]>{
        return this.deliveryTypesService.getDeliveryTypes()
    }

    @Get(":id")
    getDeliveryType(@Param("id",ParseIntPipe)id: number):Promise <DeliveryType>{
        return this.deliveryTypesService.getDeliveryType(id)
    }

    @Delete(":id")
    deleteDeliveryType(@Param("id", ParseIntPipe)id: number){
        return this.deliveryTypesService.deleteDeliveryType(id)
    }

}
