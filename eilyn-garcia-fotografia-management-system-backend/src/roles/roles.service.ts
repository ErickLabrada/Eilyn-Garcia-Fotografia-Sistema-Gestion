import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from 'src/Domain/rol.entity';
import { CreateRolDto } from 'src/dtos/rolDto/create-rol.dto';
import {Repository} from "typeorm"

@Injectable()
export class RolesService {

    constructor(@InjectRepository(Rol) private rolRepository: Repository<Rol>){

    }

    createRol(rolDto: CreateRolDto){
        const newRol = this.rolRepository.create(rolDto)
        return this.rolRepository.save(newRol)
    }

    

}
