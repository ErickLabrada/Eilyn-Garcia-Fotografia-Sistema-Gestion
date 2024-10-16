import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { SaleBundlesService } from './sale-bundles.service';
import { CreateSaleBundleDTO } from 'src/dtos/sale-bundle-dtos/create-sale-bundle.dto';
import { SaleBundle } from 'src/Domain/sale.bundle.entity';
import { UpdateSaleBundleDTO } from 'src/dtos/sale-bundle-dtos/update-sale-bundle.dto';

@Controller('sale-bundles')
export class SaleBundlesController {
    constructor(
        private saleBundlesService: SaleBundlesService
    ){}

    @Post()
    createSaleBundle(@Body() saleBundleDTO: CreateSaleBundleDTO){
        this.saleBundlesService.createSaleBundle(saleBundleDTO)
    }

    @Get()
    getSaleBundles():Promise<SaleBundle[]>{
        return this.saleBundlesService.getSaleBundles()
    }

    @Get(":id")
    getSaleBundle(@Param("id",ParseIntPipe)id: number):Promise <SaleBundle>{
        return this.saleBundlesService.getSaleBundle(id)
    }

    @Patch(":id")
    updateSaleBundle(@Param("id",ParseIntPipe)id:number, @Body()bundleDTO: UpdateSaleBundleDTO){
        this.saleBundlesService.updateSaleBundle(id, bundleDTO)
    }

    @Delete(":id")
    deleteSaleBundle(@Param("id", ParseIntPipe)id: number){
        return this.saleBundlesService.deleteSaleBundle(id)
    }
}
