import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { VirtualNodeInterface } from 'src/common/interface/relation.node.interface';
import { CreateWinformRelationDto } from '../dto/winform.relation.dto';

@Injectable()
export class WinformRelationService {
  constructor(
    @Inject(RepositoryEnums.WINFORM_STRUCTURE_RELATION)
    private readonly WinformRelationsRepository: VirtualNodeInterface<any>,
  ) {}
  async create(id: string, createWinformRelationDto: CreateWinformRelationDto) {
    return await this.WinformRelationsRepository.create(id, createWinformRelationDto);
  }
  remove(id: string) {
    return this.WinformRelationsRepository.delete(id);
  }

  async findOneNode(key: string) {
    //checkObjectIddİsValid(id);
    return await this.WinformRelationsRepository.findOneNodeByKey(key);
  }
}
