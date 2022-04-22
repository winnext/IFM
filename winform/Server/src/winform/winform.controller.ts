import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateWinformDto } from './dtos/create.winform.dto';
import { UpdateWinformDto } from './dtos/update.winform.dto';
import { Winform } from './entities/winform.entity';
import { WinformService } from './winform.service';

@Controller('winform')
export class WinformController {
    constructor(private readonly winformService: WinformService) {}


    // @ApiOperation({
    //     summary: 'Gets all facilities ',
    //     description:
    //       'If you want to get all facilities in your organization use this route. It takes no path or query params',
    //   })
      //@LoggerInter()
      @Get()
      //@Roles({ roles: [UserRoles.ADMIN] })
      async getAllWinforms(): Promise<Winform[]> {
        return this.winformService.findAll();
      }

    //   @ApiOperation({
    //     summary: 'Gets facility with id ',
    //     description:
    //       'If you want to get specific facility in your organization use this route. It takes  query params which is  id',
    //   })
      @Get('/:_id')
      //@Roles({ roles: [UserRoles.ADMIN] })
      getWinformById(@Param('_id') id: string): Promise<Winform> {
        return this.winformService.findOne(id);
      }

    //   @ApiBody({
    //     type: CreateWinformDto,
    //     description: 'Store product structure',
    //   })
      @Post('')
      //@Roles({ roles: [UserRoles.ADMIN] })
      createWinform(@Body() createWinformDto: CreateWinformDto): Promise<Winform> {
        return this.winformService.create(createWinformDto);
      }

      @Delete('/:_id')
      //@Roles({ roles: [UserRoles.ADMIN] })
      deleteWinform(@Param('_id') id: string): Promise<Winform> {
        return this.winformService.remove(id);
      }

      @Patch('/:_id')
      //@Roles({ roles: [UserRoles.ADMIN] })
      updateWinform(@Param('_id') id: string, @Body() updateWinformDto:UpdateWinformDto): Promise<Winform> {
        return this.winformService.update(id, updateWinformDto);
      }
}
