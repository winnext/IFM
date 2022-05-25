import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoCache } from 'ifmcommon/dist';
import { Unprotected } from 'nest-keycloak-connect';
import { CreateTypeDto } from './dtos/create.type.dto';
import { CreateTypePropertyDto } from './dtos/create.type.property.dto';
import { UpdateTypeDto } from './dtos/update.type.dto';
import { UpdateTypePropertyDto } from './dtos/update.type.property.dto';
import { Type } from './entities/type.entity';
import { TypeService } from './type.service';

@ApiTags('type')
@ApiBearerAuth('JWT-auth')
@Controller('type')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @Unprotected()
  @Get('/:id')
  @NoCache()
  getTypeById(@Param('id') id: string) {
    console.log(id)
    return this.typeService.findOne(id);
  }
  @Unprotected()
  @Post('')
  createType(@Body() createTypeDto: CreateTypeDto) {
    return this.typeService.createType(createTypeDto);
  }
  
  @Unprotected()
  @Post('/properties')
  @ApiBody({
    type: [CreateTypePropertyDto],
    description: 'Store product structure',
  })
  createTypeProperties(@Body() createTypeProperties: CreateTypePropertyDto[]) {
    return this.typeService.createTypeProperties(createTypeProperties);
  }
  @Unprotected()
  @Get('/nodeinfo/:key')
  @NoCache()
  findOneNode(@Param('key') key: string) {
    return this.typeService.findOneNode(key);
  }
  
  @Patch(':id')
  @Unprotected()
  updateNode(@Param('id') id: string, @Body() updateTypeDto: UpdateTypeDto) {
    return this.typeService.updateNode(id, updateTypeDto);
  }

  @Unprotected()
  @Get('/properties/:id')
  @NoCache()
  findTypePropertiesByNodeId(@Param('id') id: string)  {
    return this.typeService.findTypePropertiesByNodeId(id);
  }

  @Delete(':id')
  @Unprotected()
  remove(@Param('id') id: string) {
    return this.typeService.remove(id);
  }

  /*
      @Unprotected()
      @NoCache()
      @Get()
      async getAllTypes() {
        return this.typeService.findAll();
      }
      @Delete('/:_id')
      deleteType(@Param('_id') id: string) {
        return this.typeService.remove(id);
      }

      */
}
