import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/Domain/event.entity';
import { Bundle } from 'src/Domain/bundle.entity';
import { Contract } from 'src/Domain/contract.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Event,Bundle,Contract])],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}
 