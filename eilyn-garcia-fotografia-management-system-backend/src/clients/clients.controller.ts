import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDTO } from 'src/dtos/clientdto/create-client.dto';
import { Client } from 'src/Domain/client.entity';
import { UpdateClientDTO } from 'src/dtos/clientdto/update-client.dto';

@Controller('clients')
export class ClientsController {

    constructor(
        private clientsService: ClientsService
    ){}

    @Post()
    createClient(@Body() clientDTO: CreateClientDTO){
        return this.clientsService.createClient(clientDTO)
    }

    @Get()
    getClients():Promise<Client[]>{
        return this.clientsService.getClients()
    }

    @Get(":id")
    getClient(@Param("id",ParseIntPipe)id: number):Promise <Client>{
        return this.clientsService.getClient(id)
    }

    @Get('by-phone/:phone')
    getClientByPhone(@Param("phone")phone: string):Promise <Client>{
        return this.clientsService.getClientByPhone(phone)
    }

    @Patch(":id")
    updateClient(@Param("id",ParseIntPipe)id:number, @Body()clientDTO: UpdateClientDTO){
        this.clientsService.updateClients(id, clientDTO)
    }

    @Delete(":id")
    deleteClient(@Param("id", ParseIntPipe)id: number){
        return this.clientsService.deleteClient(id)
    }

}

