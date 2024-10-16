import { EventsEnum } from "src/Domain/enums/events.enum";

export class CreateEventDTO{
    event: EventsEnum
    bundleId: number
    contractsID: number[]
} 