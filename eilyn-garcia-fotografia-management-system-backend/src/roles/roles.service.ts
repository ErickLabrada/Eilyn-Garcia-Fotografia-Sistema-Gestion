import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from 'src/Domain/rol.entity';
import { CreateRolDto } from 'src/dtos/rolDto/create-rol.dto';
import { UpdateRolDTO } from 'src/dtos/rolDto/update-rol.dto';
import {Repository} from "typeorm"

@Injectable()
export class RolesService {

    constructor(@InjectRepository(Rol) private rolRepository: Repository<Rol>){

    }

    async createRol(rolDto: CreateRolDto){
        const newRol = this.rolRepository.create(rolDto)
        return await this.rolRepository.save(newRol)
    }

    async getRoles(){
        return await this.rolRepository.find()
    }

    async getRol(id: number){
        return await this.rolRepository.findOne({
            where:{
                id
            }
        })
    }

    async deleteRol(id: number){
        
        return await this.rolRepository.delete({id})
        
    }

    async updateRol(id:number, rol: UpdateRolDTO){
        return await this.rolRepository.update({id},rol)
    }



}
