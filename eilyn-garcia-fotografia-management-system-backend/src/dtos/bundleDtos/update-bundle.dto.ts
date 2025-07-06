export class UpdateBundleDTO{
    name?: string
    price?: number
    url?: string
    contractsId?: number[]
    itemsID?: number[]
    eventsID?:number[]
    discount?: number
    expirationDate?: Date
    appointmentTemplateID?:number
}