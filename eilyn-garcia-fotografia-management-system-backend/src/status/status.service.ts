import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contract } from 'src/Domain/contract.entity';
import { Status } from 'src/Domain/status.entity';
import { CreateStatusDTO } from 'src/dtos/statusDtos/create-status.dto';
import { UpdateStatusDTO } from 'src/dtos/statusDtos/update-status.dto';
import {In, Repository} from "typeorm"

@Injectable()
export class StatusService {
    constructor(
        @InjectRepository(Status) private statusRepository: Repository<Status>,
        @InjectRepository(Contract) private contractRepository: Repository<Contract>
    ){}

    async createStatus(statusDTO: CreateStatusDTO){

        const {contractsID,...statusData}=statusDTO

        const contractEntities= await this.contractRepository.find({
            where:{
                id: In(contractsID)
            }
        })

        const newStatus = await this.statusRepository.create({
            ...statusData,
            contracts: contractEntities
        })

        return await this.statusRepository.save(newStatus)

    }

    async getStatuses(){
        return await this.statusRepository.find()
    }

    async getStatus(id: number){
        return await this.statusRepository.findOne({
            where:{
                id
            }
        })
    }

    async deleteStatus(id: number){
        return await this.statusRepository.delete({id})
    }


}
