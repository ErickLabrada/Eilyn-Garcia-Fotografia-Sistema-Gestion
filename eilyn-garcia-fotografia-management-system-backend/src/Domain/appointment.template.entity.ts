import {Entity, ManyToOne} from "typeorm"
import {Column} from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { Bundle } from "./bundle.entity"

@Entity({name: "appointmenTemplates"})
export class AppointmentTemplate{

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "timestamp"})
    date: Date

    @Column()
    hours: number

    @Column()
    place: string

    @Column()
    description: string

    @ManyToOne(()=>Bundle, bundle => bundle.appointmentTemplates)
    bundle: Bundle

}