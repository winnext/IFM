import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NoCache } from 'ifmcommon/dist';
import { Unprotected } from 'nest-keycloak-connect';
import { CreateTypeDto } from './dtos/create.type.dto';
import { UpdateTypeDto } from './dtos/update.type.dto';
import { Type } from './entities/type.entity';
import { TypeService } from './type.service';


@ApiTags('type')
@ApiBearerAuth('JWT-auth')
@Controller('type')
export class TypeController {
    constructor(private readonly typeService: TypeService) {}

      @Unprotected()
      @NoCache()
      @Get()
      async getAllTypes() {
        return this.typeService.findAll();
      }
      @Unprotected()
      @Get('/:id')
      @NoCache()
      getTypeById(@Param('id') id: string) {
        return this.typeService.findOne(id);
      }

  
      @Post('')
      createType(@Body()   createTypeDto: CreateTypeDto) {
        return this.typeService.create(createTypeDto);
      }

      @Delete('/:_id')
      deleteType(@Param('_id') id: string) {
        return this.typeService.remove(id);
      }

      @Patch('/:_id')
      updateType(@Param('_id') id: string, @Body() updateTypeDto:UpdateTypeDto) {
        return this.typeService.update(id, updateTypeDto);
      }
}
