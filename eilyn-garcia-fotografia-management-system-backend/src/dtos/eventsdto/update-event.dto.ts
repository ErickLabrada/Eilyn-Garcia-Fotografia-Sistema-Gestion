import { EventsEnum } from "src/Domain/enums/events.enum";

export class UpdateEventDTO{
    event?: EventsEnum
    bundleId?: number
    contractsID?: number[]
} 