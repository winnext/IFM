import { Body, Controller, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateOrganizationDto } from './dtos/create.organization.dto';
import { UpdateOrganizationDto } from './dtos/update.organization.dto';
import { Facility } from './entities/facility.entity';
import { OrganizationService } from './organization.service';
import { Roles, Unprotected } from 'nest-keycloak-connect';
import { UserRoles } from 'src/common/const/keycloak.role.enum';
import { NoCache } from 'ifmcommon';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Organization')
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @ApiOperation({
    summary: 'Gets all facilities ',
    description:
      'If you want to get all facilities in your organization use this route. It takes no path or query params',
  })
  @ApiOperation({
    summary: 'Gets facility with realm ',
    description:
      'If you want to get specific facility in your organization use this route. It takes  query params which is  realm',
  })
  @Get('/:realm')
  @NoCache()
  @Roles({ roles: [UserRoles.ADMIN] })
  getFacilityByRealm(@Param('realm') realm: string): Promise<Facility> {
    return this.organizationService.findOneByRealm(realm);
  }

  @ApiOperation({
    summary: 'Gets facility with id ',
    description:
      'If you want to get specific facility in your organization use this route. It takes  query params which is  id',
  })
  @ApiBody({
    type: CreateOrganizationDto,
    description: 'Store product structure',
  })
  @Post('')
  @Unprotected()
  createFacility(@Body() createFacilityDto: CreateOrganizationDto): Promise<Facility> {
    return this.organizationService.create(createFacilityDto);
  }

  @ApiBody({
    type: UpdateOrganizationDto,
    description: 'update  facility structure',
  })
  @Patch('/:id')
  @Roles({ roles: [UserRoles.ADMIN] })
  updateFacility(@Param('id') id: string, @Body() updateFacilityDto: UpdateOrganizationDto) {
    return this.organizationService.update(id, updateFacilityDto);
  }

  @Get(':label/:realm')
  @Unprotected()
  @NoCache()
  findOne(@Param('label') label: string, @Param('realm') realm: string) {
    return this.organizationService.findOne(label, realm);
  }


  @Post('createRealmWithExcelFile')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        language:{
          type: 'string'
        }
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Upload a single excel file with a language example you can insert "EN" for English',
  })
  @ApiConsumes('multipart/form-data')
  importClassificationFromExcel(@UploadedFile() file: Express.Multer.File, @Body("language") language?:string){
    return this.organizationService.importClassificationFromExcel(file,language);
  }
}
