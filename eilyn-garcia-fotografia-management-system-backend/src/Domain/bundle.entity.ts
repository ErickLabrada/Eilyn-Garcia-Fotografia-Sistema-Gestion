import {Entity, JoinTable, ManyToMany, OneToMany, TableInheritance} from "typeorm"
import {Column} from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { Contract } from "./contract.entity"
import { Item } from "./item.entity"
import { AppointmentTemplate } from "./appointment.template.entity"
import { Event } from "./event.entity"

@Entity({name: "bundles"})
@TableInheritance({column:{type:"varchar",name:"type"}})
export class Bundle{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    price: number

    @OneToMany(()=>Contract,(contract)=>contract.bundle)
    contracts: Contract[]

    @ManyToMany(() => Item, (item) => item.bundles)  
    @JoinTable()
    items: Item[]

    @ManyToMany(()=>Event, (event)=>event.bundle)
    @JoinTable()
    events: Event[]

    @OneToMany(()=>AppointmentTemplate,(appointmentTemplate)=>appointmentTemplate.bundle)
    appointmentTemplates: AppointmentTemplate[]


}