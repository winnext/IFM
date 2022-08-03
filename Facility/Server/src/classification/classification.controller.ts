import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles, Unprotected } from 'nest-keycloak-connect';
import { PaginationNeo4jParams } from 'src/common/commonDto/pagination.neo4j.dto';
import { NoCache } from 'ifmcommon';
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
  @Get(':label/:realm')
  @NoCache()
  findOne(@Param('label') label: string, @Param('realm') realm: string) {
    
    return this.classificationService.findOne(label, realm);
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
  @Get(':key')
  @NoCache()
  findOneNode(@Param('key') key: string) {
    return this.classificationService.findOneNode(key);
  }


  @Unprotected()
  @Patch("setIsActiveFalseOfClassificationAndItsChild/:id")
  async setIsActiveFalseOfClassificationAndItsChild(@Param('id') id:string) {
    return this.classificationService.setIsActiveFalseOfClassificationAndItsChild(id);

  }

  @Unprotected()
  @Patch("setIsActiveTrueOfClassificationAndItsChild/:id")
  async setIsActiveTrueOfClassificationAndItsChild(@Param('id') id:string) {
    return this.classificationService.setIsActiveTrueOfClassificationAndItsChild(id);
  }

  @Unprotected()
  @Get("getClassificationByIsActiveStatus/:realm/:isActive/:language")
  async getClassificationByIsActiveStatus(@Param('realm') realm:string, @Param('isActive') isActive:boolean,@Param('language') language:string){
    return this.classificationService.getClassificationByIsActiveStatus(realm,isActive,language);
  }
}
