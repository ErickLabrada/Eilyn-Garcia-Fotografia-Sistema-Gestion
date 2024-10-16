import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDTO } from 'src/dtos/itemsDTO/create-item.dto';
import { Item } from 'src/Domain/item.entity';
import { UpdateItemDTO } from 'src/dtos/itemsDTO/update-item.dto';

@Controller('items')
export class ItemsController {
    constructor(private itemsService: ItemsService){}

    @Post()
    createItem(@Body() itemDTO: CreateItemDTO){
        this.itemsService.createItem(itemDTO)
    }

    @Get()
    getItems():Promise<Item[]>{
        return this.itemsService.getItems()
    }

    @Get(":id")
    getItem(@Param("id",ParseIntPipe)id: number):Promise <Item>{
        return this.itemsService.getItem(id)
    }

    @Patch(":id")
    updateITems(@Param("id",ParseIntPipe)id:number, @Body()itemDTO: UpdateItemDTO){
        this.itemsService.updateItem(id, itemDTO)
    }

}
