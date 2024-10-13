import { Body, Controller, Post } from '@nestjs/common';
import { BundleService } from './bundle.service';
import { CreateBundleDTO } from 'src/dtos/bundleDtos/create-bundle.dto';

@Controller('bundle')
export class BundleController {

    constructor(    
        private bundleService: BundleService
    ){}

    @Post()
    createBundle(@Body() bundleDTO: CreateBundleDTO){
        this.bundleService.createBundle(bundleDTO)
    }

}


