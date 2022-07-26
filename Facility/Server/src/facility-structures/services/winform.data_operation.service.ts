import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { WinformdataNodeInterface } from 'src/common/interface/winformdata.node.interface';


@Injectable()
export class WinformDataOperationService {
  constructor(
    @Inject(RepositoryEnums.WINFORM_STRUCTURE_DATA_OPERATION)
    private readonly WinformDataOperationRepository: WinformdataNodeInterface<any>
  ) {}
  async create(id: string, winformData: Object) {
    return await this.WinformDataOperationRepository.create(id, winformData);
  }
  async update(id: string, winformData: Object) {
    return await this.WinformDataOperationRepository.create(id, winformData);
  }
   async remove(key: string) {
     return this.WinformDataOperationRepository.delete(key);
   }
  async findOneNode(key: string) {
    //checkObjectIddİsValid(id);
    return await this.WinformDataOperationRepository.findOneNodeByKey(key);
  }
}
