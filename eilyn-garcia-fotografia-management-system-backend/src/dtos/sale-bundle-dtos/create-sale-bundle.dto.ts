export class CreateSaleBundleDTO{
    name: string
    price: number
    contractsId: number[]
    itemsID: number[]
    eventsID:number[]
    appointmentTemplateID:number
    expirationDate: Date
}