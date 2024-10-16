import { Rol } from "src/Domain/rol.entity"

export class UpdateEmployeeDto
{
    name?: string
    email?: string
    roles?: Rol[]
}