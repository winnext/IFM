import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FacilityStructuresService } from './facility-structures.service';
import { CreateFacilityStructureDto } from './dto/create-facility-structure.dto';
import { UpdateFacilityStructureDto } from './dto/update-facility-structure.dto';
import { Unprotected } from 'nest-keycloak-connect';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { NoCache } from 'ifmcommon';
import { PaginationNeo4jParams } from 'src/common/commonDto/pagination.neo4j.dto';
@ApiTags('structure')
@ApiBearerAuth('JWT-auth')
@Controller('structure')
export class FacilityStructuresController {
  constructor(private readonly facilityStructuresService: FacilityStructuresService) {}

  @Unprotected()
  //@Roles({ roles: [UserRoles.ADMIN] })
  @ApiBody({
    type: CreateFacilityStructureDto,
    description: 'create  facility structure',
  })
  @Post()
  create(@Body() createFacilityStructureDto: CreateFacilityStructureDto) {
    return this.facilityStructuresService.create(createFacilityStructureDto);
  }

  @Get(':label/:realm')
  @Unprotected()
  @NoCache()
  findOne(@Param('label') label: string, @Param('realm') realm: string) {
    return this.facilityStructuresService.findOne(label, realm);
  }

  @Patch(':id')
  @Unprotected()
  update(@Param('id') id: string, @Body() updateFacilityStructureDto: UpdateFacilityStructureDto) {
    return this.facilityStructuresService.update(id, updateFacilityStructureDto);
  }

  @Delete(':id')
  @Unprotected()
  remove(@Param('id') id: string) {
    return this.facilityStructuresService.remove(id);
  }
  @Unprotected()
  @Post('/relation/:id/:target_parent_id')
  changeNodeBranch(@Param('id') id: string, @Param('target_parent_id') target_parent_id: string) {
    return this.facilityStructuresService.changeNodeBranch(id, target_parent_id);
  }

  @Unprotected()
  @Get('/:key')
  @NoCache()
  findOneNode(@Param('key') key: string) {
    return this.facilityStructuresService.findOneNode(key);
  }
}
