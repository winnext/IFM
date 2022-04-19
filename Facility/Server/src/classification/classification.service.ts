import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { checkObjectIddİsValid } from 'src/common/func/objectId.check';
import { BaseInterfaceRepository } from 'src/common/repositories/crud.repository.interface';
import { CreateClassificationDto } from './dto/create-classification.dto';
import { UpdateClassificationDto } from './dto/update-classification.dto';
import { Classification } from './entities/classification.entity';
import { Span, OtelMethodCounter } from 'nestjs-otel';
import { ClassificationNotFountException } from 'src/common/notFoundExceptions/not.found.exception';

@Injectable()
export class ClassificationService {
  constructor(
    @Inject(RepositoryEnums.CLASSIFICATION)
    private readonly classificationRepository: BaseInterfaceRepository<Classification>,
  ) {}

  @Span('create a classification')
  @OtelMethodCounter()
  async create(createClassificationDto: CreateClassificationDto) {
    return await this.classificationRepository.create(createClassificationDto);
  }

  @Span('find all classifications')
  @OtelMethodCounter()
  async findAll(query) {
    return await this.classificationRepository.findAll(query);
  }

  @Span('find a classification by id')
  @OtelMethodCounter()
  async findOne(id: string) {
    checkObjectIddİsValid(id);
    return await this.classificationRepository.findOneById(id);
  }

  @Span('update a classification')
  @OtelMethodCounter()
  async update(id: string, updateClassificationDto: UpdateClassificationDto) {
    checkObjectIddİsValid(id);
    return await this.classificationRepository.update(id, updateClassificationDto);
  }

  @Span('remove a classification')
  @OtelMethodCounter()
  async remove(id: string) {
    const classification = await this.findOne(id);
    if (!classification) {
      throw new ClassificationNotFountException(id);
    }
    return await classification.remove();
  }
}
