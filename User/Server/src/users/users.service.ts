/* eslint-disable @typescript-eslint/no-var-requires */
import { Inject, Injectable } from '@nestjs/common';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { BaseInterfaceRepository } from 'src/common/repositories/crud.repository.interface';
import { Span, OtelMethodCounter } from 'nestjs-otel';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * User Service
 */
@Injectable()
export class UserService {
  constructor(
    @Inject(RepositoryEnums.USER)
    private readonly userRepository: BaseInterfaceRepository<User>,
  ) {}

  /**
   * find All User
   */
  @Span('find all User')
  @OtelMethodCounter()
  findAll(query: PaginationParams): Promise<User[]> {
    return this.userRepository.findAll(query);
  }
  /**
   * find One by userId
   */
  @Span('find a user by id')
  @OtelMethodCounter()
  async findOne(id: string): Promise<User> {
    return this.userRepository.findOneById(id);
  }
  /**
   * create user
   */
  @Span('create a user')
  @OtelMethodCounter()
  create(createFacilityDto: CreateUserDto): Promise<User> {
    return this.userRepository.create(createFacilityDto);
  }
  /**
   * update user with userId
   */
  @Span('update a user')
  @OtelMethodCounter()
  async update(id: string, updateFacilityDto: UpdateUserDto) {
    return this.userRepository.update(id, updateFacilityDto);
  }
  /**
   * delete user with userId
   */
  @Span('remove a user')
  @OtelMethodCounter()
  async remove(id: string) {
    const deletedUser = await this.userRepository.delete(id);
    return deletedUser;
  }
}
