/* eslint-disable @typescript-eslint/no-var-requires */
import { Inject, Injectable } from '@nestjs/common';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { BaseInterfaceRepository } from 'src/common/repositories/crud.repository.interface';
import { Span, OtelMethodCounter } from 'nestjs-otel';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create.room.dto';
import { UpdateRoomDto } from './dto/update.room.dto';

/**
 * Room Service
 */
@Injectable()
export class RoomService {
  /**
   * Get roomRepository instance from BaseInterfaceRepository
   */
  constructor(
    @Inject(RepositoryEnums.ROOM)
    private readonly roomRepository: BaseInterfaceRepository<Room>,
  ) {}

  /**
   * find All Rooms
   */
  @Span('find all Rooms')
  @OtelMethodCounter()
  findAll(query: PaginationParams): Promise<Room[]> {
    return this.roomRepository.findAll(query);
  }
  /**
   * find One by id
   */
  @Span('find a room by id')
  @OtelMethodCounter()
  async findOne(id: string): Promise<Room> {
    return this.roomRepository.findOneById(id);
  }
  /**
   * create room
   */
  @Span('create a room')
  @OtelMethodCounter()
  create(createRoomDto: CreateRoomDto): Promise<Room> {
    return this.roomRepository.create(createRoomDto);
  }
  /**
   * update room with id
   */
  @Span('update a room')
  @OtelMethodCounter()
  async update(id: string, updateRoomDto: UpdateRoomDto) {
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
