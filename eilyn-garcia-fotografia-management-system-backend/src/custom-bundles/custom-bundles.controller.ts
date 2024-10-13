import { Body, Controller, Post } from '@nestjs/common';
import { CustomBundlesService } from './custom-bundles.service';
import { CreateCustomBundleDTO } from 'src/dtos/custom-bundle-dto/create-custom-bundle.dto';

@Controller('custom-bundles')
export class CustomBundlesController {
    constructor(    
        private customBundleService: CustomBundlesService
    ){}

    @Post()
    createCustomBundle(@Body() customBundleDTO: CreateCustomBundleDTO){
        this.customBundleService.createCustomBundle(customBundleDTO)
    }

}
