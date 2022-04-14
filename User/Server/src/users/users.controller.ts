import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseFilters, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles, Unprotected } from 'nest-keycloak-connect';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';

import { UserRoles } from 'src/common/const/keycloak.role.enum';
import { NoCache } from 'src/common/interceptors/http.cache.interceptor';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './users.service';
import { UpdateUserInterceptor } from './interceptors/update.user.interceptor';
import { MongoExceptionFilter } from 'src/common/exceptionFilters/mongo.exception';

@ApiTags('User')
@Controller('user')
//@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Gets all User ',
    description: 'If you want to get all User in your organization use this route. It takes no path or query params',
  })
  //@LoggerInter()
  @Get('/')
  @NoCache()
  //@Roles({ roles: [UserRoles.ADMIN] })
  @Unprotected()
  async getAll(@Query() params: PaginationParams): Promise<User[]> {
    return this.userService.findAll(params);
  }
  @ApiOperation({
    summary: 'Gets User with id ',
    description:
      'If you want to get specific User in your organization use this route. It takes  query params which is  id',
  })
  @Get('/:userId')
  //@Roles({ roles: [UserRoles.ADMIN] })
  @Unprotected()
  getById(@Param('userId') id: string): Promise<User> {
    return this.userService.findOne(id);
  }
  @ApiBody({
    type: CreateUserDto,
    description: 'Store User structure',
  })
  @Post('')
  //@Roles({ roles: [UserRoles.ADMIN] })
  @Unprotected()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @ApiBody({
    type: UpdateUserDto,
    description: 'update  User structure',
  })
  @Patch('/:_id')
  //@Roles({ roles: [UserRoles.ADMIN] })
  @UseInterceptors(UpdateUserInterceptor)
  @Unprotected()
  update(@Param('_id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete('/:_id')
  //@Roles({ roles: [UserRoles.ADMIN] })
  @Unprotected()
  deleteFacility(@Param('_id') id: string) {
    return this.userService.remove(id);
  }
}
