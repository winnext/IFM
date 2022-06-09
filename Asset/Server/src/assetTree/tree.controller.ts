import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles, Unprotected } from 'nest-keycloak-connect';
import { PaginationNeo4jParams } from 'src/common/commonDto/pagination.neo4j.dto';
import { NoCache } from 'ifmcommon';
import { TreeService } from './tree.service';
import { CreateTreeDto } from './dto/create.tree.dto';
import { UpdateTreeDto } from './dto/update.tree.dto';
import { CreateTestDto } from './dto/create.test.dto';

@ApiTags('Tree')
@ApiBearerAuth('JWT-auth')
@Controller('tree')
export class TreeController {
  constructor(private readonly classificationService: TreeService) {}

  @Post()
  //@Roles({ roles: [FacilityUserRoles.ADMIN] })
  @Unprotected()
  create(@Body() createClassificationDto: CreateTreeDto) {
    return this.classificationService.create(createClassificationDto);
  }

  @Post('/test')
  //@Roles({ roles: [FacilityUserRoles.ADMIN] })
  @Unprotected()
  testRelation(@Body() createClassificationDto: CreateTestDto) {
    return this.classificationService.createTestRelation(createClassificationDto);
  }
  @Unprotected()
  @Get()
  @NoCache()
  findAll(@Query() paramDto: PaginationNeo4jParams) {
    return this.classificationService.findAll(paramDto);
  }
  @Unprotected()
  @Get(':id')
  @NoCache()
  findOne(@Param('id') id: string) {
    return this.classificationService.findOne(id);
  }
  @Unprotected()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassificationDto: UpdateTreeDto) {
    return this.classificationService.update(id, updateClassificationDto);
  }
  @Unprotected()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classificationService.remove(id);
  }
  @Unprotected()
  @Post('/relation/:id/:target_parent_id')
  changeNodeBranch(@Param('id') id: string, @Param('target_parent_id') target_parent_id: string) {
    return this.classificationService.changeNodeBranch(id, target_parent_id);
  }

  @Unprotected()
  @Get('/nodeinfo/:key')
  @NoCache()
  findOneNode(@Param('key') key: string) {
    return this.classificationService.findOneNode(key);
  }
}
