import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles, Unprotected } from 'nest-keycloak-connect';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';

import { UserRoles } from 'src/common/const/keycloak.role.enum';
import { NoCache } from 'ifmcommon';
import { CreateRoomDto } from './dto/create.room.dto';
import { UpdateRoomDto } from './dto/update.room.dto';
import { Room } from './entities/room.entity';
import { RoomService } from './room.service';

/**
 * Room Contoller
 */
@ApiTags('Room')
@Controller('room')
//@ApiBearerAuth('JWT-auth')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  /**
   * Get All Rooms with pagination
   */
  @ApiOperation({
    summary: 'Gets all Rooms with pagination',
    description: 'If you want to get all Room in your organization use this route. It takes no path or query params',
  })
  @Get('/')
  @NoCache()
  @HttpCode(200)
  //@Roles({ roles: [UserRoles.ADMIN] })
  @Unprotected()
  async getAll(@Query() params: PaginationParams): Promise<Room[]> {
    return this.roomService.findAll(params);
  }

  /**
   * Get Room by id
   */
  @ApiOperation({
    summary: 'Gets Room with id ',
    description:
      'If you want to get specific Room in your organization use this route. It takes  query params which is  id',
  })
  @Get('/:_id')
  //@Roles({ roles: [UserRoles.ADMIN] })
  @Unprotected()
  getById(@Param('_id') id: string): Promise<Room> {
    return this.roomService.findOne(id);
  }

  /**
   * Create Room
   */
  @ApiBody({
    type: CreateRoomDto,
    description: 'Store Room structure',
  })
  @Post('')
  //@Roles({ roles: [UserRoles.ADMIN] })
  @Unprotected()
  create(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    return this.roomService.create(createRoomDto);
  }
  /**
   * Update Room with id
   */
  @ApiBody({
    type: UpdateRoomDto,
    description: 'update  User structure',
  })
  @Patch('/:_id')
  //@Roles({ roles: [UserRoles.ADMIN] })
  @Unprotected()
  update(@Param('_id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(id, updateRoomDto);
  }

  /**
   * Delete Room with id
   */
  @Delete('/:_id')
  //@Roles({ roles: [UserRoles.ADMIN] })
  @Unprotected()
  deleteFacility(@Param('_id') id: string) {
    return this.roomService.remove(id);
  }
}
