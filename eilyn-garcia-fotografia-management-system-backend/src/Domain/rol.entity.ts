import {Entity} from "typeorm"
import { Column } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"

@Entity({name: "roles"})
export class Rol{
    
    @PrimaryGeneratedColumn()
    id: number
    @Column()
    rol: String

}