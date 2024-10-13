import { Rol } from "src/Domain/rol.entity"

export class CreateEmployeeDto
{
    name: string
    email: string
    roles: Rol[]
}