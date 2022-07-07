import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { Unprotected } from 'nest-keycloak-connect';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { NoCache } from 'ifmcommon';
import { AssetRelationService } from '../services/asset.relation.service';
import { CreateAssetRelationDto } from '../dto/asset.relation.dto';

@ApiTags('structureAssetRelation')
@ApiBearerAuth('JWT-auth')
@Controller('structureAssetRelation')
export class AssetRelationController {
  constructor(private readonly structureRelationService: AssetRelationService) {}

  @Unprotected()
  //@Roles({ roles: [UserRoles.ADMIN] })
  @ApiBody({
    type: CreateAssetRelationDto,
    description: 'create  structure-asset relation',
  })
  @Post('/:key')
  createAssetVirtualRelation(@Param('key') key: string, @Body() createAssetRelationDto: CreateAssetRelationDto) {
    return this.structureRelationService.create(key, createAssetRelationDto);
  }

  @Get('/:id')
  @Unprotected()
  @NoCache()
  findOne(@Param('id') id: string) {
    return this.structureRelationService.findOne(id);
  }

  @Delete(':id')
  @Unprotected()
  remove(@Param('id') id: string) {
    return this.structureRelationService.remove(id);
  }

  @Unprotected()
  @Get('/:key')
  @NoCache()
  findOneNode(@Param('key') key: string) {
    return this.structureRelationService.findOneNode(key);
  }
}
