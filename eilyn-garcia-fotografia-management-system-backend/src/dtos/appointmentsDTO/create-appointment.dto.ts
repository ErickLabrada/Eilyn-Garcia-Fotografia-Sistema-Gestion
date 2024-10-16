export class CreateAppointmentDTO{

    date:Date
    hours: number
    place: string
    description: string
    bundleId:number
    employeeID?: number
    contractID?: number
}