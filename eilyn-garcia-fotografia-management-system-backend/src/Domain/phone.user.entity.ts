import {Column} from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"

export abstract class PhoneUser{

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    phone: string

}