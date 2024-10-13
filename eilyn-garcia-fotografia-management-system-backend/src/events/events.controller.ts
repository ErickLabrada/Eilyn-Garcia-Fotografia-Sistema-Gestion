import { Body, Controller, Post } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDTO } from 'src/dtos/eventsdto/create-event.dto';

@Controller('events')
export class EventsController {

    constructor(
        private eventsService:EventsService
    ){}

    @Post()
    createEvent(@Body() eventDTO: CreateEventDTO){
        this.eventsService.createEventRepository(eventDTO)
    }
}
 