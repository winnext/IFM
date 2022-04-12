import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles, Unprotected } from 'nest-keycloak-connect';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { FacilityUserRoles } from 'src/common/const/keycloak.role.enum';
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
  @Roles({ roles: [FacilityUserRoles.ADMIN] })
  create(@Body() createClassificationDto: CreateClassificationDto) {
    return this.classificationService.create(createClassificationDto);
  }
  @Unprotected()
  @Get()
  @NoCache()
  findAll(@Query() paramDto: PaginationParams) {
    return this.classificationService.findAll(paramDto);
  }
  @Unprotected()
  @Get(':id')
  @NoCache()
  findOne(@Param('id') id: string) {
    return this.classificationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClassificationDto: UpdateClassificationDto) {
    return this.classificationService.update(id, updateClassificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classificationService.remove(id);
  }
}
