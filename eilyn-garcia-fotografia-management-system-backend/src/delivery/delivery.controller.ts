import { Body, Controller, Post } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDTO } from 'src/dtos/deliveryDto/create-delivery.dto';

@Controller('delivery')
export class DeliveryController {
    
    constructor(
        private deliveryService:DeliveryService
    ){}

    @Post()
    createRol(@Body() newDelivery: CreateDeliveryDTO){
        this.deliveryService.createDelivery(newDelivery)
    }

}
