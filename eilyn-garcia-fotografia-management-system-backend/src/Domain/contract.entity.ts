import {Entity, ManyToOne, OneToMany} from "typeorm"
import {Column} from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { Appointment } from "./appointment.entity"
import { Delivery } from "./delivery.entity"
import { Bundle } from "./bundle.entity"
import { Client } from "./client.entity"
import { Status } from "./status.entity"
import { Event } from "./event.entity"

@Entity({name: "contracts"})
export class Contract{

    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    cost: number

    @Column()
    celebratedsName: string

    @Column()
    description: string

    @Column({nullable: true})
    postingConsent: boolean

    @Column({type: "date"})
    guarantee: Date

    @OneToMany(()=>Appointment,(appointment)=>appointment.contract)
    appointments: Appointment[]

    @OneToMany(()=>Delivery,(delivery)=>delivery.contract)
    deliverys: Delivery[]

    @ManyToOne(()=>Bundle, bundle=>bundle.contracts)
    bundle: Bundle

    @ManyToOne(()=>Client, client=>client.contracts)
    client: Client

    @ManyToOne(()=>Event, event => event.contracts)
    event: Event

    @ManyToOne(()=>Status, status=>status.contracts)
    status: Status

}