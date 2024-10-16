import { StatusEnum } from "src/Domain/enums/status.enum";

export class UpdateStatusDTO{

    status?: StatusEnum
    contractsID?: number[]

}