import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider } from 'src/Domain/provider.entity';
import { CreateProviderDTO } from 'src/dtos/providerDto/create-provider.dto';
import { UpdateProviderDTO } from 'src/dtos/providerDto/update-provider.dto';
import { Item } from 'src/Domain/item.entity';
import { In, Repository } from "typeorm"

@Injectable()
export class ProvidersService {

  constructor(
    @InjectRepository(Provider) private providerRepository: Repository<Provider>,
    @InjectRepository(Item) private itemRepository: Repository<Item>
  ) {}

  async createProvider(providerDTO: CreateProviderDTO) {
  const { itemsID = [], ...providerData } = providerDTO;

  // Paso 1: Crear y guardar el proveedor
  const newProvider = this.providerRepository.create(providerData);
  const savedProvider = await this.providerRepository.save(newProvider);

  // Paso 2: Buscar los ítems y asignarles el proveedor
  if (itemsID.length > 0) {
    const itemsEntities = await this.itemRepository.findBy({ id: In(itemsID) });

    for (const item of itemsEntities) {
      item.provider = savedProvider; // ← aquí se establece la relación
    }

    await this.itemRepository.save(itemsEntities);

    // Opcional: incluir los ítems en el objeto retornado
    savedProvider.items = itemsEntities;
  }

  return savedProvider;
}

  async getProviders() {
    return await this.providerRepository.find({
      relations: ['items'] 
    });
  }

  async getProvider(id: number) {
    return await this.providerRepository.findOne({
      where: { id },
      relations: ['items']
    });
  }

  async updateProvider(id: number, providerDTO: UpdateProviderDTO) {
    return await this.providerRepository.update({ id }, providerDTO);
  }

  async deleteProvider(id: number) {
    return await this.providerRepository.delete({ id });
  }
}
