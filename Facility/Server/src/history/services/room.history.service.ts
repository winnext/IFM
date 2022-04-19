import { Inject, Injectable } from '@nestjs/common';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { checkObjectIddİsValid } from 'src/common/func/objectId.check';
import { BaseHistoryRepositoryInterface } from 'src/common/repositories/history.repository.interface';

import { Span, OtelMethodCounter } from 'nestjs-otel';
import { CreateRoomHistoryDto } from '../dtos/create.room.history.dto';
import { RoomHistory } from '../entities/room.history.entity';

/**
 *  User  History Service
 */
@Injectable()
export class RoomHistoryService {
  constructor(
    @Inject(RepositoryEnums.ROOM_HISTORY)
    private readonly roomHistoryRepository: BaseHistoryRepositoryInterface<RoomHistory>,
  ) {}

  /**
   * Create User  History
   */
  async create(createRoomHistoryDto: CreateRoomHistoryDto) {
    return await this.roomHistoryRepository.create(createRoomHistoryDto);
  }

  /**
   * Get All User  History
   */
  @Span('find all histories of the user')
  @OtelMethodCounter()
  async findAll(query) {
    return await this.roomHistoryRepository.findAll(query);
  }

  /**
   * find specific User  History
   */
  @Span('find one a history of the room by id')
  @OtelMethodCounter()
  async findOne(id: string) {
    checkObjectIddİsValid(id);
    return await this.roomHistoryRepository.findOneById(id);
  }
}
