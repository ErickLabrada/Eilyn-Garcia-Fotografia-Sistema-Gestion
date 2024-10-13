import { Body, Controller, Post } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDTO } from 'src/dtos/clientdto/create-client.dto';

@Controller('clients')
export class ClientsController {

    constructor(
        private clientsService: ClientsService
    ){}

    @Post()
    createClient(@Body() clientDTO: CreateClientDTO){
        this.clientsService.createClient(clientDTO)
    }

}

