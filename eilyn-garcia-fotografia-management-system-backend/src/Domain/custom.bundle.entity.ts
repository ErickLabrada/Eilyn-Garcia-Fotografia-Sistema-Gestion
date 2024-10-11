import {ChildEntity, Entity} from "typeorm"
import { Column } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { Bundle } from "./bundle.entity"

@ChildEntity()
export class CustomBundle extends Bundle{

}