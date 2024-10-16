import { Delivery } from "src/Domain/delivery.entity";
import { DeliveryTypeEnum } from "src/Domain/enums/delivery-type.enum";

export class CreateDeliveryTypeDto{
    deliveryType: DeliveryTypeEnum
    deliverys: Delivery[]

}