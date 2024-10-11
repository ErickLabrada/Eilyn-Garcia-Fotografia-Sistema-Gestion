import { Entity, OneToMany} from "typeorm"
import {Column} from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { PhoneUser } from "./phone.user.entity"
import { Contract } from "./contract.entity"

@Entity({name: "statuses"})
    export class Status {

        @PrimaryGeneratedColumn()
        id: number

        @Column()
        status: String

        @OneToMany(()=>Contract,(contract)=>contract.status)
        contracts: Contract[]

    }
