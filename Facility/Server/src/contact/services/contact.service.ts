import { Inject, Injectable } from '@nestjs/common';
import { BaseGraphDatabaseInterfaceRepository } from 'ifmcommon';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { GeciciInterface } from 'src/common/interface/gecici.interface';
import { CreateContactDto } from '../dto/create-contact.dto';
import { UpdateContactDto } from '../dto/update-contact.dto';


@Injectable()
export class ContactService {
  constructor(
    @Inject(RepositoryEnums.CONTACT)
    private readonly contactRepository: GeciciInterface<any>,
  ) {}
  async create(createContactDto: CreateContactDto) {
    return await this.contactRepository.create(createContactDto);
  }

  findOne(label: string, realm: string) {
    return this.contactRepository.findOneByRealm(label, realm);
  }

  update(id: string, updateContactDto: UpdateContactDto) {
    return this.contactRepository.update(id, updateContactDto);
  }

  remove(id: string) {
    return this.contactRepository.delete(id);
  }

  async changeNodeBranch(id: string, target_parent_id: string) {
    return await this.contactRepository.changeNodeBranch(id, target_parent_id);
  }

  async findOneNode(key: string) {
    //checkObjectIddİsValid(id);
    return await this.contactRepository.findOneNodeByKey(key);
  }
}
