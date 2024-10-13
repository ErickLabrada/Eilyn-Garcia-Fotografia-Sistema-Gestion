import { Body, Controller, Post } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDTO } from 'src/dtos/contractsDtos/create-contract.dto';

@Controller('contracts')
export class ContractsController {
    constructor(private contractsService: ContractsService){}

    @Post()
    createContract(@Body() contractDTO: CreateContractDTO){
        this.contractsService.createContract(contractDTO)
    }
}
