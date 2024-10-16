import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/Domain/item.entity';
import { Provider } from 'src/Domain/provider.entity';
import { Bundle } from 'src/Domain/bundle.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Item,Provider,Bundle])],
  controllers: [ItemsController],
  providers: [ItemsService]
})
export class ItemsModule {}
