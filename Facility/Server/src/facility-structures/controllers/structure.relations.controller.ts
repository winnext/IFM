import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { CreateFacilityStructureDto } from '../dto/create-facility-structure.dto';
import { UpdateFacilityStructureDto } from '../dto/update-facility-structure.dto';
import { Unprotected } from 'nest-keycloak-connect';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { NoCache } from 'ifmcommon';
import { StructureRelationsService } from '../services/structure.relations.service';
import { CreateAssetRelationDto } from '../dto/asset.relation.dto';
@ApiTags('structureRelation')
@ApiBearerAuth('JWT-auth')
@Controller('structureRelation')
export class StructureRelationsController {
  constructor(private readonly structureRelationService: StructureRelationsService) {}

  @Unprotected()
  //@Roles({ roles: [UserRoles.ADMIN] })
  @ApiBody({
    type: CreateFacilityStructureDto,
    description: 'create  facility structure',
  })
  @Post('/Asset/:id')
  createAssetVirtualRelation(@Param('id') id: string, @Body() createAssetRelationDto: CreateAssetRelationDto) {
    return this.structureRelationService.create(id, createAssetRelationDto);
  }

  @Get('/Asset/:id')
  @Unprotected()
  @NoCache()
  findOne(@Param('id') id: string) {
    return this.structureRelationService.findOne(id);
  }

  @Patch(':id')
  @Unprotected()
  update(@Param('id') id: string, @Body() updateFacilityStructureDto: UpdateFacilityStructureDto) {
    return this.structureRelationService.update(id, updateFacilityStructureDto);
  }

  @Delete(':id')
  @Unprotected()
  remove(@Param('id') id: string) {
    return this.structureRelationService.remove(id);
  }
  @Unprotected()
  @Post('/relation/:id/:target_parent_id')
  changeNodeBranch(@Param('id') id: string, @Param('target_parent_id') target_parent_id: string) {
    return this.structureRelationService.changeNodeBranch(id, target_parent_id);
  }

  @Unprotected()
  @Get('/:key')
  @NoCache()
  findOneNode(@Param('key') key: string) {
    return this.structureRelationService.findOneNode(key);
  }
}
