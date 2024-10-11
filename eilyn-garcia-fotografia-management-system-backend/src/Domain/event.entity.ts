import {Entity, OneToMany} from "typeorm"
import { Column } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { Bundle } from "./bundle.entity"
import { Contract } from "./contract.entity"

@Entity({name: "events"})
export class Event {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    event: string

    @OneToMany(()=>Contract,(contract)=>contract.event)
    contracts: Contract[]

}