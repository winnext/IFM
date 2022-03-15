import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { checkObjectIddİsValid } from 'src/common/func/objectId.check';
import { ClassificationNotFountException } from 'src/common/notFoundExceptions/facility.not.found.exception';
import { BaseInterfaceRepository } from 'src/common/repositories/crud.repository.interface';
import { CreateClassificationDto } from './dto/create-classification.dto';
import { UpdateClassificationDto } from './dto/update-classification.dto';
import { Classification } from './entities/classification.entity';

@Injectable()
export class ClassificationService {
  constructor(
    @Inject(RepositoryEnums.CLASSIFICATION)
    private readonly classificationRepository: BaseInterfaceRepository<Classification>,
  ) {}
  async create(createClassificationDto: CreateClassificationDto) {
    return await this.classificationRepository.create(createClassificationDto);
  }

  async findAll(query) {
    const { skip, limit } = query;
    return await this.classificationRepository.findAll(query);
  }

  async findOne(id: string) {
    checkObjectIddİsValid(id);
    return await this.classificationRepository.findOneById(id);
  }

  async update(id: string, updateClassificationDto: UpdateClassificationDto) {
    checkObjectIddİsValid(id);
    return await this.classificationRepository.update(
      id,
      updateClassificationDto,
    );
  }

  async remove(id: string) {
    const classification = await this.findOne(id);
    if (!classification) {
      throw new ClassificationNotFountException(id);
    }
    return await classification.remove();
  }
}
