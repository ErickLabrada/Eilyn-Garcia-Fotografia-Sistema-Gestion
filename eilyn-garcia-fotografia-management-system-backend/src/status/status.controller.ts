import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDTO } from 'src/dtos/statusDtos/create-status.dto';
import { Status } from 'src/Domain/status.entity';
import { UpdateStatusDTO } from 'src/dtos/statusDtos/update-status.dto';

@Controller('status')
export class StatusController {
    constructor(private statusService: StatusService){}

    @Post()
    createStatus(@Body() statusDTO: CreateStatusDTO){
        this.statusService.createStatus(statusDTO)
    }

    @Get()
    getStatuses():Promise<Status[]>{
        return this.statusService.getStatuses()
    }

    @Get(":id")
    getStatus(@Param("id",ParseIntPipe)id: number):Promise <Status>{
        return this.statusService.getStatus(id)
    }

    @Delete(":id")
    deleteStatus(@Param("id", ParseIntPipe)id: number){
        return this.statusService.deleteStatus(id)
    }
}
