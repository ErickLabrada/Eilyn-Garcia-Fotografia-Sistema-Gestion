import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CustomBundlesService } from './custom-bundles.service';
import { CreateCustomBundleDTO } from 'src/dtos/custom-bundle-dto/create-custom-bundle.dto';
import { CustomBundle } from 'src/Domain/custom.bundle.entity';
import { UpdateCustomBundleDTO } from 'src/dtos/custom-bundle-dto/update-custom-bundle.dto';

@Controller('custom-bundles')
export class CustomBundlesController {
    constructor(    
        private customBundleService: CustomBundlesService
    ){}

    @Post()
    createCustomBundle(@Body() customBundleDTO: CreateCustomBundleDTO){
        this.customBundleService.createCustomBundle(customBundleDTO)
    }

    @Get()
    getCusomBundles():Promise<CustomBundle[]>{
        return this.customBundleService.getCustomBundles()
    }

    @Get(":id")
    getCustomBundle(@Param("id",ParseIntPipe)id: number):Promise <CustomBundle>{
        return this.customBundleService.getCustomBundle(id)
    }

    @Patch(":id")
    updateCustomBundle(@Param("id",ParseIntPipe)id:number, @Body()bundleDTO: UpdateCustomBundleDTO){
        this.customBundleService.updateCustomBundle(id, bundleDTO)
    }

    @Delete(":id")
    deleteCustomBundles(@Param("id", ParseIntPipe)id: number){
        return this.customBundleService.deleteCustomBundle(id)
    }

}
