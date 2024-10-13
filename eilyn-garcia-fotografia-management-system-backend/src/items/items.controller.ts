import { Body, Controller, Post } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDTO } from 'src/dtos/itemsDTO/create-item.dto';

@Controller('items')
export class ItemsController {
    constructor(private itemsService: ItemsService){}

    @Post()
    createItem(@Body() itemDTO: CreateItemDTO){
        this.itemsService.createItem(itemDTO)
    }

}
