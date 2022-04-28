import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles, Unprotected } from 'nest-keycloak-connect';
import { PaginationParams } from 'src/common/commonDto/pagination.dto';

import { UserRoles } from 'src/common/const/keycloak.role.enum';
import { NoCache } from 'ifmcommon';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './users.service';
import { UpdateUserInterceptor } from './interceptors/update.user.interceptor';

/**
 * User Contoller
 */
@ApiTags('User')
@Controller('user')
//@ApiBearerAuth('JWT-auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * Get All Users with pagination
   */
  @ApiOperation({
    summary: 'Gets all Users with pagination',
    description: 'If you want to get all User in your organization use this route. It takes no path or query params',
  })
  @Get('/')
  @NoCache()
  @HttpCode(200)
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
  /**
   * Get User by userid
   */
  @Get('/:userId')
  //@Roles({ roles: [UserRoles.ADMIN] })
  @Unprotected()
  getById(@Param('userId') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  /**
   * Create User
   */
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
  /**
   * Update User with userId
   */
  @ApiBody({
    type: UpdateUserDto,
    description: 'update  User structure',
  })
  @Patch('/:userId')
  //@Roles({ roles: [UserRoles.ADMIN] })
  @UseInterceptors(UpdateUserInterceptor)
  @Unprotected()
  update(@Param('userId') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * Delete User with userId
   */
  @Delete('/:userId')
  //@Roles({ roles: [UserRoles.ADMIN] })
  @Unprotected()
  deleteFacility(@Param('userId') id: string) {
    return this.userService.remove(id);
  }
}
