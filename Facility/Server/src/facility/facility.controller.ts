import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateFacilityDto } from './dtos/create.facility.dto';
import { UpdateFacilityDto } from './dtos/update.facility.dto';
import { Facility } from './entities/facility.entity';
import { FacilityService } from './facility.service';
import { Roles } from 'nest-keycloak-connect';
import { UserRoles } from 'src/common/const/keycloak.role.enum';
import { NoCache } from 'ifmcommon';

@ApiTags('Facility')
@Controller('facility')
@ApiBearerAuth('JWT-auth')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @ApiOperation({
    summary: 'Gets all facilities ',
    description:
      'If you want to get all facilities in your organization use this route. It takes no path or query params',
  })
  //@LoggerInter()
  @ApiOperation({
    summary: 'Gets facility with id ',
    description:
      'If you want to get specific facility in your organization use this route. It takes  query params which is  id',
  })
  @Get('/:realm')
  @NoCache()
  @Roles({ roles: [UserRoles.ADMIN] })
  getFacility(@Param('realm') realm: string): Promise<Facility> {
    return this.facilityService.findOne(realm);
  }
  @ApiBody({
    type: CreateFacilityDto,
    description: 'Store product structure',
  })
  @Post('')
  @Roles({ roles: [UserRoles.ADMIN] })
  createFacility(@Body() createFacilityDto: CreateFacilityDto): Promise<Facility> {
    return this.facilityService.create(createFacilityDto);
  }

  @ApiBody({
    type: UpdateFacilityDto,
    description: 'update  facility structure',
  })
  @Patch('/:_id')
  @Roles({ roles: [UserRoles.ADMIN] })
  updateFacility(@Param('_id') id: string, @Body() updateFacilityDto: UpdateFacilityDto) {
    return this.facilityService.update(id, updateFacilityDto);
  }
}
