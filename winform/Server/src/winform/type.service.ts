import { Inject, Injectable } from '@nestjs/common';
import { BaseInterfaceRepository } from '../common/repositories/crud.repository.interface';
import { CreateTypeDto } from './dtos/create.type.dto';
import { UpdateTypeDto } from './dtos/update.type.dto';
import { Type } from './entities/type.entity';

@Injectable()
export class TypeService {
  constructor(
    @Inject('Type')
    private readonly typeRepository: BaseInterfaceRepository<Type>,
  ) {}

  findAll() {
    return this.typeRepository.findAll();
  }

  async findOne(id: string){
    return this.typeRepository.findOneById(id);
  }

  create(createTypeDto: CreateTypeDto) {
    return this.typeRepository.create(createTypeDto);
  }

  async update(id: string, updateTypeDto: UpdateTypeDto) {
    //checkObjectIddİsValid(id);
    return this.typeRepository.update(id, updateTypeDto);
  }

  async remove(id: string) {

    return await this.typeRepository.delete(id)
  }
}
