import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDTO } from 'src/dtos/eventsdto/create-event.dto';
import { Event } from 'src/Domain/event.entity';
import { UpdateEventDTO } from 'src/dtos/eventsdto/update-event.dto';
import { EventsEnum } from 'src/Domain/enums/events.enum';

@Controller('events')
export class EventsController {

    constructor(
        private eventsService:EventsService
    ){}

    @Post()
    createEvent(@Body() eventDTO: CreateEventDTO){
        this.eventsService.createEventRepository(eventDTO)
    }

    @Get()
    getEvents():Promise<Event[]>{
        return this.eventsService.getEvents()
    }

    @Get(":id")
    getEvent(@Param("id",ParseIntPipe)id: number):Promise <Event>{
        return this.eventsService.getEvent(id)
    }

    @Patch(":id")
    updateEvent(@Param("id",ParseIntPipe)id:number, @Body()eventDTO: UpdateEventDTO){
        this.eventsService.updateEvent(id, eventDTO)
    }

    @Delete(":id")
    deleteEvent(@Param("id", ParseIntPipe)id: number){
        return this.eventsService.deleteEvent(id)
    }

    @Get('by-name/:name')
async getEventByName(@Param('name') event: EventsEnum) {
    return await this.eventsService.getEventByName(event);
}

}
 