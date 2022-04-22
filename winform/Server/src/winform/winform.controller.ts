import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateWinformDto } from './dtos/create.winform.dto';
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
      getWinform(@Param('_id') id: string): Promise<Winform> {
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
}
