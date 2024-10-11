import {Entity, ManyToOne} from "typeorm"
import {Column} from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { Provider } from "./provider.entity"

@Entity({name: "items"})
export class Item{

    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    name: string
    
    @Column()
    description: string

    @ManyToOne(()=>Provider,provider=>provider.items)
    provider: Provider

}