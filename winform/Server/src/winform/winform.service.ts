import { Inject, Injectable } from '@nestjs/common';
import { BaseInterfaceRepository } from '../common/repositories/crud.repository.interface';
import { CreateWinformDto } from './dtos/create.winform.dto';
import { Winform } from './entities/winform.entity';

@Injectable()
export class WinformService {

    constructor(
        @Inject('Winform')
        private readonly winformRepository: BaseInterfaceRepository<Winform>,
      ) {}

      
      findAll(): Promise<Winform[]> {
        return this.winformRepository.findAll();
      }
    
     
      async findOne(id: string): Promise<Winform> {
        return this.winformRepository.findOneById(id);
      }
    
    
      create(createWinformDto: CreateWinformDto): Promise<Winform> {
        return this.winformRepository.create(createWinformDto);
      }
    
     
    //   async update(id: string, updateWinformDto: UpdateWinformDto) {
    //     //checkObjectIddİsValid(id);
    //     return this.winformRepository.update(id, updateWinformDto);
    //   }
    
      
    //   async remove(id: string) {
    //     const winform = await this.findOne(id);
    //     return winform.remove();
    //   }


}
