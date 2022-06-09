/* eslint-disable @typescript-eslint/no-var-requires */
import { Inject, Injectable } from '@nestjs/common';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { BaseInterfaceRepository } from 'ifmcommon';
import { Span, OtelMethodCounter } from 'nestjs-otel';
import { Asset } from './entities/room.entity';
import { CreateAssetDto } from './dto/create.asset.dto';
import { UpdateAssetDto } from './dto/update.room.dto';

/**
 * Room Service
 */
@Injectable()
export class AssetService {
  /**
   * Get roomRepository instance from BaseInterfaceRepository
   */
  constructor(
    @Inject(RepositoryEnums.ASSET)
    private readonly roomRepository: BaseInterfaceRepository<Asset>,
  ) {}

  /**
   * find All Rooms
   */
  @Span('find all Rooms')
  @OtelMethodCounter()
  findAll(query: PaginationParams): Promise<Asset[]> {
    return this.roomRepository.findAll(query);
  }
  /**
   * find One room by id
   */
  @Span('find a room by id')
  @OtelMethodCounter()
  async findOne(id: string): Promise<Asset> {
    return this.roomRepository.findOneById(id);
  }
  /**
   * create room
   */
  @Span('create a room')
  @OtelMethodCounter()
  create(createRoomDto: CreateAssetDto): Promise<Asset> {
    return this.roomRepository.create(createRoomDto);
  }
  /**
   * update room with id
   */
  @Span('update a room')
  @OtelMethodCounter()
  async update(id: string, updateRoomDto: UpdateAssetDto) {
    return this.roomRepository.update(id, updateRoomDto);
  }
  /**
   * delete room with id
   */
  @Span('remove a room')
  @OtelMethodCounter()
  async remove(id: string) {
    const deletedRoom = await this.roomRepository.delete(id);
    return deletedRoom;
  }
}
