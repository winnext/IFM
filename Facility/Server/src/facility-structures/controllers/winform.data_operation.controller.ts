import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { NoCache } from 'ifmcommon';
import { WinformDataOperationService } from '../services/winform.data_operation.service';


@ApiTags('structureWinformDataOperation')
@ApiBearerAuth('JWT-auth')
@NoCache()
@Controller('structureWinformDataOperation')
export class WinformDataOperationController {
  constructor(private readonly winformDataOperationService: WinformDataOperationService) {}

  @Unprotected()
  //@Roles({ roles: [UserRoles.ADMIN] })
  @ApiBody({
    //type: CreateWinformRelationDto,
    description: 'create  structure-winform data node',
  })
  @Post('/:key')
  createWinformData(@Param('key') key: string, @Body() winformData: Object) {
    return this.winformDataOperationService.create(key, winformData);
  }
  @Unprotected()
  @ApiBody({
    description: 'update  structure-winform data node',
  })
  @Patch('/:key')
  updateWinformData(@Param('key') key: string, @Body() winformData: Object) {
    return this.winformDataOperationService.update(key, winformData);
  }

  @Delete('/:key')
  @Unprotected()
  remove(@Param('key') key: string) {
    return this.winformDataOperationService.remove(key);
  }

  @Unprotected()
  @Get('/:key')
  @NoCache()
  findOneNode(@Param('key') key: string) {
    return this.winformDataOperationService.findOneNode(key);
  }
}
