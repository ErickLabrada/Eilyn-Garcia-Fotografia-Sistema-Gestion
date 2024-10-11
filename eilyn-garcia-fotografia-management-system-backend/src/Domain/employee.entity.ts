import {Entity, JoinTable, ManyToMany, OneToMany} from "typeorm"
import {Column} from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { Delivery } from "./delivery.entity"
import { Appointment } from "./appointment.entity"
import { Rol } from "./rol.entity"

@Entity({name: "employees"})
export class Employee{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({unique: true})
    email: string

    @OneToMany(()=>Delivery,(delivery)=>delivery.employee)
    deliverys: Delivery[]

    @OneToMany(()=>Appointment,(appointment)=>appointment.employee)
    appointments: Appointment[]

    @ManyToMany(()=>Rol)
    @JoinTable()
    roles: Rol[]

}