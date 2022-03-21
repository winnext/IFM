import { Module } from '@nestjs/common';
import { MessagebrokerController } from './messagebroker.controller';
import { HistoryModule } from 'src/history/history.module';

@Module({
  imports: [HistoryModule],
  controllers: [MessagebrokerController],
})
export class MessagebrokerModule {}
