import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { FacilityStructuresService } from './facility-structures.service';
import { CreateFacilityStructureDto } from './dto/create-facility-structure.dto';
import { UpdateFacilityStructureDto } from './dto/update-facility-structure.dto';
import { Roles, Unprotected } from 'nest-keycloak-connect';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { UserRoles } from 'src/common/const/keycloak.role.enum';
@ApiTags('structure')
@ApiBearerAuth('JWT-auth')
@Controller('structure')
export class FacilityStructuresController {
  constructor(private readonly facilityStructuresService: FacilityStructuresService) {}

  @Roles({ roles: [UserRoles.ADMIN] })
  @ApiBody({
    type: CreateFacilityStructureDto,
    description: 'create  facility structure',
  })
  @Post()
  @Unprotected()
  create(@Body() createFacilityStructureDto: CreateFacilityStructureDto) {
    return this.facilityStructuresService.create(createFacilityStructureDto);
  }

  @Get()
  @Unprotected()
  findAll(@Query() queryParams: PaginationParams) {
    return this.facilityStructuresService.findAll(queryParams);
  }

  @Get(':id')
  @Unprotected()
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
}
