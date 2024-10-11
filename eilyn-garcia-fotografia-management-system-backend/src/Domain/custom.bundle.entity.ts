import {Entity} from "typeorm"
import { Column } from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { Bundle } from "./bundle.entity"

@Entity({name: "customBundles"})
export class CustomBundle extends Bundle{

}