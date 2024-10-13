import { Body, Controller, Post } from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDTO } from 'src/dtos/statusDtos/create-status.dto';

@Controller('status')
export class StatusController {
    constructor(private statusService: StatusService){}

    @Post()
    createStatus(@Body() statusDTO: CreateStatusDTO){
        this.statusService.createStatus(statusDTO)
    }

}
