import { Body, Controller, Post } from '@nestjs/common';
import { SaleBundlesService } from './sale-bundles.service';
import { CreateSaleBundleDTO } from 'src/dtos/sale-bundle-dtos/create-sale-bundle.dto';

@Controller('sale-bundles')
export class SaleBundlesController {
    constructor(
        private saleBundlesService: SaleBundlesService
    ){}

    @Post()
    createSaleBundle(@Body() saleBundleDTO: CreateSaleBundleDTO){
        this.saleBundlesService.createSaleBundle(saleBundleDTO)
    }
}
