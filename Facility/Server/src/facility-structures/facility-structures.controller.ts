import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FacilityStructuresService } from './facility-structures.service';
import { CreateFacilityStructureDto } from './dto/create-facility-structure.dto';
import { UpdateFacilityStructureDto } from './dto/update-facility-structure.dto';
import { Roles, Unprotected } from 'nest-keycloak-connect';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { UserRoles } from 'src/common/const/keycloak.role.enum';
import { NoCache } from 'src/common/interceptors/http.cache.interceptor';
import { ClassNames } from 'src/common/const/classname.enum';
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

  @Get()
  @Unprotected()
  @NoCache()
  
  findAll(@Query() queryParams: PaginationNeo4jParams ) {
    return this.facilityStructuresService.findAll(queryParams);
  }

  @Get(':id')
  @Unprotected()
  @NoCache()
  findOne(@Param('id') id: string) {
    return this.facilityStructuresService.findOne(id);
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
  @Get('/nodeinfo/:key')
  @NoCache()
  findOneNode(@Param('key') key: string) {
    return this.facilityStructuresService.findOneNode(key);
  }
}
