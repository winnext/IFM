import { Module } from '@nestjs/common';
import { WinformService } from './winform.service';
import { WinformController } from './winform.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WinformRepository } from './repositories/winform.repository';
import { Winform, WinformSchema } from './entities/winform.entity';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        {
          name: Winform.name,
          schema: WinformSchema,
        },
      ],
      'winform',
    ),
  ],
  providers: [
    WinformService,
    {
      provide: 'Winform',
      useClass: WinformRepository,
    },
  ],
  controllers: [WinformController],
})
export class WinformModule {}
