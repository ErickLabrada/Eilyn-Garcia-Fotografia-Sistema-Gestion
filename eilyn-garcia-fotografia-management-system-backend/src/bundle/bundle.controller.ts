import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { BundleService } from './bundle.service';
import { CreateBundleDTO } from 'src/dtos/bundleDtos/create-bundle.dto';
import { Bundle } from 'src/Domain/bundle.entity';
import { UpdateBundleDTO } from 'src/dtos/bundleDtos/update-bundle.dto';

@Controller('bundle')
export class BundleController {

    constructor(    
        private bundleService: BundleService
    ){}

    @Post()
    createBundle(@Body() bundleDTO: CreateBundleDTO){
        this.bundleService.createBundle(bundleDTO)
    }

    @Get()
    getBundles():Promise<Bundle[]>{
        return this.bundleService.getBundles()
    }

    @Get(":id")
    getBundle(@Param("id",ParseIntPipe)id: number):Promise <Bundle>{
        return this.bundleService.getBundle(id)
    }

    @Patch(":id")
    updateBundle(@Param("id",ParseIntPipe)id:number, @Body()bundleDTO: UpdateBundleDTO){
        this.bundleService.updateBundle(id, bundleDTO)
    }

    @Delete(":id")
    deleteStatus(@Param("id", ParseIntPipe)id: number){
        return this.bundleService.deleteBundle(id)
    }
} 


