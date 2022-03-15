import { Module } from '@nestjs/common';
import { MessagebrokerController } from './messagebroker.controller';

@Module({
  controllers: [MessagebrokerController],
})
export class MessagebrokerModule {}
