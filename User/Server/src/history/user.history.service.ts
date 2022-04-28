import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { BaseHistoryRepositoryInterface } from 'ifmcommon';
import { Span, OtelMethodCounter } from 'nestjs-otel';
import { CreateUserHistoryDto } from './dtos/create.user.history.dto';
import { UserHistory } from './entities/user.history.entity';

/**
 *  User  History Service
 */
@Injectable()
export class UserHistoryService {
  /**
   *  Inject User  History Repository
   */
  constructor(
    @Inject(RepositoryEnums.USER_HISTORY)
    private readonly userHistoryRepository: BaseHistoryRepositoryInterface<UserHistory>,
  ) {}

  /**
   * Create User  History
   */
  async create(createFacilityHistoryDto: CreateUserHistoryDto) {
    return await this.userHistoryRepository.create(createFacilityHistoryDto);
  }

  /**
   * Get All User  History
   */
  @Span('find all histories of the user')
  @OtelMethodCounter()
  async findAll(query) {
    return await this.userHistoryRepository.findAll(query);
  }

  /**
   * find specific User  History
   */
  @Span('find one a history of the user by id')
  @OtelMethodCounter()
  async findOne(id: string) {
    return await this.userHistoryRepository.findOneById(id);
  }
}
