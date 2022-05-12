import { Module } from '@nestjs/common';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { MessagebrokerController } from './messagebroker.controller';

@Module({
  imports: [MinioClientModule],
  controllers: [MessagebrokerController],
})
export class MessagebrokerModule {}
