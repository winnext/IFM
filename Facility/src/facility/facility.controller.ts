import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateFacilityDto } from './dtos/create.facility.dto';
import { UpdateFacilityDto } from './dtos/update.facility.dto';
import { FacilityService } from './facility.service';

@ApiTags('facility')
@Controller('facility')
export class FacilityController {
  constructor(private readonly facilityService: FacilityService) {}

  @ApiOperation({
    summary: 'Gets all facilities ',
    description:
      'If you want to get all facilities in your organization use this route. It takes no path or query params',
  })
  @Get('')
  getAllFacilities() {
    return this.facilityService.findAll();
  }

  @ApiOperation({
    summary: 'Gets facility with id ',
    description:
      'If you want to get specific facility in your organization use this route. It takes  query params which is  id',
  })
  @Get('/:id')
  getFacility(@Param('id') id: string) {
    return this.facilityService.findOne(id);
  }

  @ApiBody({
    type: CreateFacilityDto,
    description: 'Store product structure',
  })
  @Post('')
  createFacility(@Body() createFacilityDto: CreateFacilityDto) {
    return this.facilityService.create(createFacilityDto);
  }

  @Patch('/:id')
  updateFacility(
    @Param('id') id: string,
    @Body() updateFacilityDto: UpdateFacilityDto,
  ) {
    return this.facilityService.update(id, updateFacilityDto);
  }

  @Delete('/:id')
  deleteFacility(@Param('id') id: string) {
    return this.facilityService.remove(id);
  }
}
