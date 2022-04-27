import { Module } from '@nestjs/common';
import { TestService } from './test.service';
import { TestController } from './test.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TestRepository } from './repositories/test.repository';
import { Test, TestSchema } from './entities/test.entity';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: Test.name,
          schema: TestSchema,
        },
      ],
      'winform',
    ),
  ],
  controllers: [TestController],
  providers: [
    TestService,
    {
      provide: 'Test',
      useClass: TestRepository,
    },
  ],
})
export class TestModule {}
