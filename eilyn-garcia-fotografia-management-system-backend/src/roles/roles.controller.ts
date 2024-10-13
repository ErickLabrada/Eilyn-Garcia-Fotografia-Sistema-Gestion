import { Body, Controller, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto } from 'src/dtos/rolDto/create-rol.dto';

@Controller('roles')
export class RolesController {

    constructor(
        private rolesService:RolesService
    ){
        
    }

    @Post()
    createRol(@Body() newRol: CreateRolDto){
        this.rolesService.createRol(newRol)
    }

}
