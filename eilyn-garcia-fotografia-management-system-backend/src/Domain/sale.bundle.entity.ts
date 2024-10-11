import {ChildEntity, Entity} from "typeorm"
import { Column } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { Bundle } from "./bundle.entity"

@ChildEntity()
export class SaleBundle extends Bundle{

    @Column({type: "date"})
    expirationDate: Date

}