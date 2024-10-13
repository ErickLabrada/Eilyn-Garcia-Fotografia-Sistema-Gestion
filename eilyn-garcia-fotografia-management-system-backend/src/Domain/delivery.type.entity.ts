import {Entity, OneToMany} from "typeorm"
import {Column} from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { Delivery } from "./delivery.entity"
import { DeliveryTypeEnum } from "./enums/delivery-type.enum"

@Entity({name: "deliveryTypes"})
export class DeliveryType{

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: "enum",
        enum: DeliveryTypeEnum,
    })
    type: DeliveryTypeEnum

    @OneToMany(()=>Delivery,(delivery)=>delivery.deliveryType)
    deliverys: Delivery[]

}