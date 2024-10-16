import {Column} from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"

export abstract class PhoneUser{

    @PrimaryGeneratedColumn()
    id: number

    @Column({ default: 'Default Name' })
    name: string;

    @Column()
    phone: string

}