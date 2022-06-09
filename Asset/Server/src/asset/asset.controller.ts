import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles, Unprotected } from 'nest-keycloak-connect';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';

import { UserRoles } from 'src/common/const/keycloak.role.enum';
import { NoCache } from 'ifmcommon';
import { Asset } from './entities/room.entity';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create.asset.dto';
import { UpdateAssetDto } from './dto/update.room.dto';

/**
 * Room Contoller
 */
@ApiTags('Asset')
@Controller('asset')
//@ApiBearerAuth('JWT-auth')
export class AssetController {
  constructor(private readonly roomService: AssetService) {}

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
  async getAll(@Query() params: PaginationParams): Promise<Asset[]> {
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
  getById(@Param('_id') id: string): Promise<Asset> {
    return this.roomService.findOne(id);
  }

  /**
   * Create Room
   */
  @ApiBody({
    type: CreateAssetDto,
    description: 'Store Room structure',
  })
  @Post('')
  //@Roles({ roles: [UserRoles.ADMIN] })
  @Unprotected()
  create(@Body() createRoomDto: CreateAssetDto): Promise<Asset> {
    return this.roomService.create(createRoomDto);
  }
  /**
   * Update Room with id
   */
  @ApiBody({
    type: UpdateAssetDto,
    description: 'update  User structure',
  })
  @Patch('/:_id')
  //@Roles({ roles: [UserRoles.ADMIN] })
  @Unprotected()
  update(@Param('_id') id: string, @Body() updateRoomDto: UpdateAssetDto) {
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
