import {Entity, ManyToOne} from "typeorm"
import {Column} from "typeorm"
import { PrimaryGeneratedColumn } from "typeorm"
import { AppointmentTemplate } from "./appointment.template.entity"
import { Employee } from "./employee.entity"
import { Contract } from "./contract.entity"

@Entity({name: "appointments"})
export class Appointment extends AppointmentTemplate{

    @ManyToOne(()=>Employee, employee=>employee.appointments)
    employee: Employee

    @ManyToOne(()=>Contract, contract=>contract.appointments)
    contract: Contract

}