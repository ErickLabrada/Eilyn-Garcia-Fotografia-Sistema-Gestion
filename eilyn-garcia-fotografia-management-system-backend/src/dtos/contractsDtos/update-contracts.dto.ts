import { StatusEnum } from "src/Domain/enums/status.enum"

export class UpdateContractDTO{

    cost?: number
    celebratedsName?: string
    description?: string
    postingConsent?: boolean
    guarantee?: Date
    appointmentsID?: number[]
    deliverysID: number[]
    bundleID?: number
    clientID?: number
    eventID?: number
    statusID?: number

}