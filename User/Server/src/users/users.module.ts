import { Module } from '@nestjs/common';

import { User, UserSchema } from './entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionEnums } from 'src/common/const/connection.enum';
import { RepositoryEnums } from 'src/common/const/repository.enum';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './users.controller';
import { UserService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: User.name,
          schema: UserSchema,
        },
      ],
      ConnectionEnums.USER,
    ),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: RepositoryEnums.USER,
      useClass: UserRepository,
    },
  ],
})
export class UsersModule {}
