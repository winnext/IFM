import { Module } from '@nestjs/common';
import { HistoryModule } from 'src/kiramenKatibin/history.module';
import { MessagebrokerController } from './messagebroker.controller';

@Module({
  imports: [HistoryModule],
  controllers: [MessagebrokerController],
})
export class MessagebrokerModule {}
