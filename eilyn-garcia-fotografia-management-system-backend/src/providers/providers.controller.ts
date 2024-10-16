import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDTO } from 'src/dtos/providerDto/create-provider.dto';
import { Provider } from 'src/Domain/provider.entity';
import { UpdateProviderDTO } from 'src/dtos/providerDto/update-provider.dto';

@Controller('providers')
export class ProvidersController {

    constructor(private providersService:ProvidersService){}

    @Post()
    createProvider(@Body() providerDTO: CreateProviderDTO){
        this.providersService.createProvider(providerDTO)
    }

    @Get()
    getProviders():Promise<Provider[]>{
        return this.providersService.getProviders()
    }

    @Get(":id")
    getProvider(@Param("id",ParseIntPipe)id: number):Promise <Provider>{
        return this.providersService.getProvider(id)
    }

    @Patch(":id")
    updateProvider(@Param("id",ParseIntPipe)id:number, @Body()providerDTO: UpdateProviderDTO){
        this.providersService.updateProvider(id, providerDTO)
    }

    @Delete(":id")
    deleteProvider(@Param("id", ParseIntPipe)id: number){
        return this.providersService.deleteProvider(id)
    }
}
