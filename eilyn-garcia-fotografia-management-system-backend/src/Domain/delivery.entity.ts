import {Entity} from "typeorm"
import {Column} from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { ManyToOne } from "typeorm"
import { DeliveryType } from "./delivery.type.entity"
import { Employee } from "./employee.entity"
import { Contract } from "./contract.entity"

@Entity({name: "deliverys"})
export class Delivery{

    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "date"})
    date: Date

    @ManyToOne(()=>DeliveryType, deliveryType=>deliveryType.deliverys)
    deliveryType: DeliveryType

    @ManyToOne(()=>Employee,employee=>employee.deliverys)
    employee: Employee

    @ManyToOne(()=>Contract,contract=>contract.deliverys)
    contract: Contract

}  