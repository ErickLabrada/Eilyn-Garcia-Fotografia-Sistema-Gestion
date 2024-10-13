import { Body, Controller, Post } from '@nestjs/common';
import { DeliveryTypesService } from './delivery-types.service';
import { CreateDeliveryTypeDto } from 'src/dtos/delivery-type-dto/create-delivery-type.dto';

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

}
