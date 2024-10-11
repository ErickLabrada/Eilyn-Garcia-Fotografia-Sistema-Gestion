import {Entity, OneToMany} from "typeorm"
import {Column} from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { Delivery } from "./delivery.entity"

@Entity({name: "deliveryTypes"})
export class DeliveryType{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: string

    @OneToMany(()=>Delivery,(delivery)=>delivery.deliveryType)
    deliverys: Delivery[]

}