import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDTO } from 'src/dtos/contractsDtos/create-contract.dto';
import { Contract } from 'src/Domain/contract.entity';
import { UpdateContractDTO } from 'src/dtos/contractsDtos/update-contracts.dto';

@Controller('contracts')
export class ContractsController {
    constructor(private contractsService: ContractsService){}

    @Post()
    createContract(@Body() contractDTO: CreateContractDTO){
        this.contractsService.createContract(contractDTO)
    }

    @Get()
    getContracts():Promise<Contract[]>{
        return this.contractsService.getContracts()
    }

    @Get(":id")
    getContract(@Param("id",ParseIntPipe)id: number):Promise <Contract>{
        return this.contractsService.getContract(id)
    }

    @Patch(":id")
    updateContract(@Param("id",ParseIntPipe)id:number, @Body()contractDTO: UpdateContractDTO){
        this.contractsService.updateContract(id, contractDTO)
    }
    @Delete(":id")
    deleteStatus(@Param("id", ParseIntPipe)id: number){
        return this.contractsService.deleteContract(id)
    }

}
