import { Inject, Injectable } from '@nestjs/common';
import { BaseInterfaceRepository } from '../common/repositories/crud.repository.interface';
import { CreateTypeDto } from './dtos/create.type.dto';
import { CreateTypePropertyDto } from './dtos/create.type.property.dto';
import { UpdateTypeDto } from './dtos/update.type.dto';
import { Type } from './entities/type.entity';

@Injectable()
export class TypeService {
  constructor(
    @Inject('Type')
    private readonly typeRepository: GeciciTypeInterface,
  ) {}
  /*
  findAll() {
    return this.typeRepository.findAll();
  }

  
  async remove(id: string) {
    return await this.typeRepository.delete(id);
  }
  */

  async findOne(id: string) {
    return this.typeRepository.findOneById(id);
  }

  createType(createTypeDto: CreateTypeDto) {
    return this.typeRepository.createType(createTypeDto);
  }
  async createTypeProperties(createTypeProperties: CreateTypePropertyDto[]) {
    return this.typeRepository.createTypeProperties(createTypeProperties);
  }
  async findOneNode(key: string) {
    //checkObjectIddİsValid(id);
    return await this.typeRepository.findOneNodeByKey(key);
  }
  
  updateNode(id: string, updateTypeDto: UpdateTypeDto) {
    return this.typeRepository.updateNode(id, updateTypeDto);
  }
  
}

export interface GeciciTypeInterface {
  //ifmcommon  a eklenecek
  findOneById(id: string);
  createType(createTypeDto: CreateTypeDto);
  createTypeProperties(createTypeProperties: CreateTypePropertyDto[]);
  findOneNodeByKey(key: string);
  updateNode(id: string, updateTypeDto: UpdateTypeDto);  
}
