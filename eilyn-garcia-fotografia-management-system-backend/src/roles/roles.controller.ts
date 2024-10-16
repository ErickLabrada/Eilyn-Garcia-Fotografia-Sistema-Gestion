import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRolDto } from 'src/dtos/rolDto/create-rol.dto';
import { Rol } from 'src/Domain/rol.entity';
import { UpdateRolDTO } from 'src/dtos/rolDto/update-rol.dto';
import { userInfo } from 'os';

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

    @Get()
    getRoles():Promise <Rol[]>{
        return this.rolesService.getRoles()
    }

    @Get(":id")
    getRol(@Param("id",ParseIntPipe)id: number):Promise <Rol>{
        return this.rolesService.getRol(id)
    }

    @Patch(":id")
    updateRol(@Param("id",ParseIntPipe)id:number, @Body()rol:UpdateRolDTO){
        this.rolesService.updateRol(id,rol)
    }

    @Delete(":id")
    deleteRol(@Param("id", ParseIntPipe)id: number){
        return this.rolesService.deleteRol(id)
    }

}
