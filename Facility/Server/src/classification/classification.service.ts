import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { CreateClassificationDto } from './dto/create-classification.dto';
import { UpdateClassificationDto } from './dto/update-classification.dto';
import { Span, OtelMethodCounter } from 'nestjs-otel';
import { BaseGraphDatabaseInterfaceRepository } from 'ifmcommon';
import { GeciciInterface } from 'src/common/interface/gecici.interface';

@Injectable()
export class ClassificationService {
  constructor(
    @Inject(RepositoryEnums.CLASSIFICATION)
    private readonly classificationRepository: GeciciInterface<any>,
  ) {}

  @Span('create a classification')
  @OtelMethodCounter()
  async create(createClassificationDto: CreateClassificationDto) {
    return await this.classificationRepository.create(createClassificationDto);
  }

  @Span('find a classification by id')
  @OtelMethodCounter()
  async findOne(label: string, realm: string) {
    //checkObjectIddİsValid(id);
    
    return await this.classificationRepository.findOneByRealm(label, realm);
  }

  @Span('update a classification')
  @OtelMethodCounter()
  async update(id: string, updateClassificationDto: UpdateClassificationDto) {
    //checkObjectIddİsValid(id);
    return await this.classificationRepository.update(id, updateClassificationDto);
  }

  @Span('remove a classification')
  @OtelMethodCounter()
  async remove(id: string) {
    return await this.classificationRepository.delete(id);
  }
  @Span('change none branch')
  @OtelMethodCounter()
  async changeNodeBranch(id: string, target_parent_id: string) {
    return await this.classificationRepository.changeNodeBranch(id, target_parent_id);
  }

  @Span('find a classification node by key')
  @OtelMethodCounter()
  async findOneNode(key: string) {
    //checkObjectIddİsValid(id);
    return await this.classificationRepository.findOneNodeByKey(key);
  }

  @Span('change isActive status a node and if its has children change isActive status of children')
  @OtelMethodCounter()
  async setIsActiveTrueOfClassificationAndItsChild(id:string){
    return await this.classificationRepository.setIsActiveTrueOfClassificationAndItsChild(id);
  }


  @Span('change isActive status a node and if its has children change isActive status of children')
  @OtelMethodCounter()
  async setIsActiveFalseOfClassificationAndItsChild(id:string){
    return await this.classificationRepository.setIsActiveFalseOfClassificationAndItsChild(id);
  }

  @Span('get all classifications by realm, isActive and language')
  @OtelMethodCounter()
  async getClassificationByIsActiveStatus(realm: string,isActive:boolean,language: string){
    return await this.classificationRepository.getClassificationByIsActiveStatus(realm,isActive,language);
  }


  
}
