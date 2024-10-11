import { Entity, OneToMany} from "typeorm"
import {Column} from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { PhoneUser } from "./phone.user.entity"
import { Contract } from "./contract.entity"

@Entity({name: "clients"})
    export class Client extends PhoneUser{

        @OneToMany(()=>Contract,(contract)=>contract.client)
        contracts: Contract[]

    }
