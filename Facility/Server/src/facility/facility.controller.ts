import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateFacilityDto } from './dtos/create.facility.dto';
import { UpdateFacilityDto } from './dtos/update.facility.dto';
import { Facility } from './entities/facility.entity';
import { FacilityService } from './facility.service';
import { Roles } from 'nest-keycloak-connect';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRoles } from 'src/common/const/keycloak.role.enum';
import { NoCache } from 'src/common/interceptors/http.cache.interceptor';

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
  @Get('/')
  @NoCache()
  @Roles({ roles: [UserRoles.ADMIN] })
  async getAllFacilities(@Query() params: PaginationParams): Promise<Facility[]> {
    return this.facilityService.findAll(params);
  }
  @ApiOperation({
    summary: 'Gets facility with id ',
    description:
      'If you want to get specific facility in your organization use this route. It takes  query params which is  id',
  })
  @Get('/:_id')
  @Roles({ roles: [UserRoles.ADMIN] })
  getFacility(@Param('_id') id: string): Promise<Facility> {
    return this.facilityService.findOne(id);
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

  @Delete('/:_id')
  @Roles({ roles: [UserRoles.ADMIN] })
  deleteFacility(@Param('_id') id: string) {
    return this.facilityService.remove(id);
  }

  @ApiOperation({
    summary: 'Load facility cs file ',
    description: '***',
  })
  @Roles({ roles: [UserRoles.ADMIN] })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('createfacilities')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({ destination: './upload' }),
    }),
  )
  async createFacilitiesByCsv(@Res() res, @UploadedFile() file: Express.Multer.File) {
    return res.send(await this.facilityService.createAll(file));
  }
}
