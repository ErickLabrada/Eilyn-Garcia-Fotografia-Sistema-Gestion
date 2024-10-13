import {Entity, ManyToOne, OneToMany} from "typeorm"
import { Column } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { Bundle } from "./bundle.entity"
import { Contract } from "./contract.entity"
import { EventsEnum } from "./enums/events.enum"

@Entity({name: "events"})
export class Event {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "enum",
        enum: EventsEnum,
        default: EventsEnum.OTHER,
    })
    event: EventsEnum

    @OneToMany(()=>Contract,(contract)=>contract.event)
    contracts: Contract[]

    @ManyToOne(()=>Bundle, (bundle)=>bundle.events)
    bundle: Bundle

}