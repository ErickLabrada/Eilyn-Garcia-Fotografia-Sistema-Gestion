import { Body, Controller, Post } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDTO } from 'src/dtos/providerDto/create-provider.dto';

@Controller('providers')
export class ProvidersController {

    constructor(private providersService:ProvidersService){}

    @Post()
    createProvider(@Body() providerDTO: CreateProviderDTO){
        this.providersService.createProvider(providerDTO)
    }

}
