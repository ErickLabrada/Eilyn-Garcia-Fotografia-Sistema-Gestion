import {Collection, Entity, OneToMany} from "typeorm"
import {Column} from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { PhoneUser } from "./phone.user.entity"
import { Item } from "./item.entity"

@Entity({name: "providers"})
    export class Provider extends PhoneUser{

        @OneToMany(()=>Item,(item)=>item.provider)
        items: Item[]
        
    }
