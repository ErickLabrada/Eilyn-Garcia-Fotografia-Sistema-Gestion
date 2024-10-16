import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { CreateDeliveryDTO } from 'src/dtos/deliveryDto/create-delivery.dto';
import { Delivery } from 'src/Domain/delivery.entity';
import { UpdateDeliveryDTO } from 'src/dtos/deliveryDto/update-delivery,dto';

@Controller('delivery')
export class DeliveryController {
    
    constructor(
        private deliveryService:DeliveryService
    ){}

    @Post()
    createRol(@Body() newDelivery: CreateDeliveryDTO){
        this.deliveryService.createDelivery(newDelivery)
    }

    @Get()
    getDeliverys():Promise<Delivery[]>{
        return this.deliveryService.getDeliverys()
    }

    @Get(":id")
    detDelivery(@Param("id",ParseIntPipe)id: number):Promise <Delivery>{
        return this.deliveryService.getDelivery(id)
    }

    @Patch(":id")
    updateDelivery(@Param("id",ParseIntPipe)id:number, @Body()deliverDTO: UpdateDeliveryDTO){
        this.deliveryService.updateDelivery(id, deliverDTO)
    }

    @Delete(":id")
    deleteStatus(@Param("id", ParseIntPipe)id: number){
        return this.deliveryService.deleteDelivery(id)
    }

}
