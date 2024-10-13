import { StatusEnum } from "src/Domain/enums/status.enum";

export class CreateStatusDTO{

    status: StatusEnum
    contractsID: number[]

}