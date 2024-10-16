import {Entity, ManyToMany} from "typeorm"
import { Column } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { Employee } from "./employee.entity"
import { RolesEnum } from "./enums/rol.enum"

@Entity({name: "roles"})
export class Rol{
    
    @PrimaryGeneratedColumn()
    id: number
    @Column({
        type: "enum",
        enum: RolesEnum,
        default: RolesEnum.UNDEFINED,
    })
    rol: RolesEnum
    @ManyToMany(()=>Employee, employee=>employee.roles)
    employees: Employee[]

}