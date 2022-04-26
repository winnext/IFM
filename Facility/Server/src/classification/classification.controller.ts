import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles, Unprotected } from 'nest-keycloak-connect';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { NoCache } from 'src/common/interceptors/http.cache.interceptor';
import { ClassificationService } from './classification.service';
import { CreateClassificationDto } from './dto/create-classification.dto';
import { UpdateClassificationDto } from './dto/update-classification.dto';

@ApiTags('Classification')
@ApiBearerAuth('JWT-auth')
@Controller('classification')
export class ClassificationController {
  constructor(private readonly classificationService: ClassificationService) {}

  @Post()
  //@Roles({ roles: [FacilityUserRoles.ADMIN] })
  @Unprotected()
  create(@Body() createClassificationDto: CreateClassificationDto) {
    return this.classificationService.create(createClassificationDto);
  }
  @Unprotected()
  @Get(':class_name')
  @NoCache()
  findAll(@Query() paramDto: PaginationParams, @Param('class_name') class_name: string) {
    return this.classificationService.findAll(paramDto,class_name);
  }
  @Unprotected()
  @Get(':id')
  @NoCache()
  findOne(@Param('id') id: string) {
    return this.classificationService.findOne(id);
  }
  @Unprotected()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassificationDto: UpdateClassificationDto) {
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
