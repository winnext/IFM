import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { NoCache } from 'ifmcommon';
import { CreateWinformRelationDto } from '../dto/winform.relation.dto';
import { WinformRelationService } from '../services/winform.relation.service';
//import { AssetRelationService } from '../services/asset.relation.service';
//import { CreateAssetRelationDto } from '../dto/asset.relation.dto';

@ApiTags('structureWinformRelation')
@ApiBearerAuth('JWT-auth')
@Controller('structureWinformRelation')
export class WinformRelationController {
  constructor(private readonly structureRelationService: WinformRelationService) {}

  @Unprotected()
  //@Roles({ roles: [UserRoles.ADMIN] })
  @ApiBody({
    type: CreateWinformRelationDto,
    description: 'create  structure-winform relation',
  })
  @Post('/:key')
  createWinformVirtualRelation(@Param('key') key: string, @Body() createWinformRelationDto: CreateWinformRelationDto) {
    return this.structureRelationService.create(key, createWinformRelationDto);
  }

  @Delete('/:key/:referenceKey')
  @Unprotected()
  remove(@Param('key') key: string, @Param('referenceKey') referenceKey: string) {
    return this.structureRelationService.remove(key, referenceKey);
  }

  @Unprotected()
  @Get('/:key')
  @NoCache()
  findOneNode(@Param('key') key: string) {
    return this.structureRelationService.findOneNode(key);
  }
}
