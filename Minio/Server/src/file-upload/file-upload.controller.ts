import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { PostKafka, KafkaService } from 'ifmcommon/dist';
import { kafkaConf } from 'src/common/const/kafka.conf';

@Controller('file-upload')
export class FileUploadController {
  /**
   * create variable for postKafka Service
   */
  postKafka: PostKafka;

  constructor(private fileUploadService: FileUploadService) {
    this.postKafka = new PostKafka(new KafkaService(kafkaConf));
  }

  @Post('single')
  @UseInterceptors(FileInterceptor('image'))
  async uploadSingle(@UploadedFile() image: BufferedFile) {
    const x = await this.postKafka.producerSendMessage('test', 'test', 'user');

    return await this.fileUploadService.uploadSingle(image);
  }

  @Post('many')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image1', maxCount: 1 },
      { name: 'image2', maxCount: 1 },
    ]),
  )
  async uploadMany(@UploadedFiles() files: BufferedFile) {
    return this.fileUploadService.uploadMany(files);
  }
}
