import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { BundleService } from './bundle.service';
import { CreateBundleDTO } from 'src/dtos/bundleDtos/create-bundle.dto';
import { Bundle } from 'src/Domain/bundle.entity';
import { UpdateBundleDTO } from 'src/dtos/bundleDtos/update-bundle.dto';
import { EventsEnum } from 'src/Domain/enums/events.enum';

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

    @Get('by-event-type/:eventType')
    async getBundlesByEventType(@Param('eventType') eventType: EventsEnum) {
        return await this.bundleService.getBundlesByEventType(eventType);
    }

    @Get('by-name/:name')
    async getBundleByName(@Param('name') name: string): Promise<Bundle> {
        try {
            return await this.bundleService.getBundleByName(name);
        } catch (error) {
            // Handle the error accordingly
            console.error('Error fetching bundle by name:', error);
            throw new Error('Could not fetch the bundle. Please try again later.');
        }
    }
} 


