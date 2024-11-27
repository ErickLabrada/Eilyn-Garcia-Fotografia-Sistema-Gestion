import { StatusEnum } from "src/Domain/enums/status.enum"

export class CreateContractDTO{

    cost: number
    celebratedsName: string
    description: string
    postingConsent: boolean
    appointmentsID: number[]
    deliverysID: number[]
    bundleID: number
    clientID: number
    eventID: number
    statusID: number

}