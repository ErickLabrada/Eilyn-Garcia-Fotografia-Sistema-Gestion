import { Contract } from "src/Domain/contract.entity"
import { DeliveryType } from "src/Domain/delivery.type.entity"
import { Employee } from "src/Domain/employee.entity"
import { DeliveryTypeEnum } from "src/Domain/enums/delivery-type.enum"

export class UpdateDeliveryDTO{

    date?: Date
    employeeId?: number;
    contracts?: Contract[]

}