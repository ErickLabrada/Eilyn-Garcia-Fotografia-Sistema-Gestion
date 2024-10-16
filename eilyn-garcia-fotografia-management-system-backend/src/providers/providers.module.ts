import { Module } from '@nestjs/common';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { Provider } from 'src/Domain/provider.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from 'src/Domain/contract.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Provider,Contract])],
  controllers: [ProvidersController],
  providers: [ProvidersService]
})
export class ProvidersModule {}
