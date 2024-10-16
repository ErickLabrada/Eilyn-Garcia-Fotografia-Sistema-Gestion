import { EventsEnum } from "src/Domain/enums/events.enum";

export class CreateEventDTO{
    event: EventsEnum
    bundlesId: number[]
    contractsID: number[]
} 