import { Entity, OneToMany} from "typeorm"
import {Column} from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { PhoneUser } from "./phone.user.entity"
import { Contract } from "./contract.entity"
import { StatusEnum } from "./enums/status.enum"

@Entity({name: "statuses"})
    export class Status {

        @PrimaryGeneratedColumn()
        id: number

        @Column({
            type: "enum",
            enum: StatusEnum,
            default: StatusEnum.PENDING,
        })
        status: StatusEnum

        @OneToMany(()=>Contract,(contract)=>contract.status)
        contracts: Contract[]

    }
