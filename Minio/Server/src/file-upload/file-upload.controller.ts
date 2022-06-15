import { Controller, Post, UseInterceptors, UploadedFile, UploadedFiles, Delete, Body, Get, Param } from '@nestjs/common';
import { FileInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express';
import {  ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileUploadService } from './file-upload.service';
import { BufferedFile } from 'src/minio-client/file.model';
import { PostKafka, KafkaService } from 'ifmcommon/dist';
import { kafkaConf } from 'src/common/const/kafka.conf';


@ApiTags('FileUploadController')
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Upload a single file or image'
  })
  @ApiConsumes('multipart/form-data')
  async uploadSingle(@UploadedFile() image: BufferedFile) {
    const x = await this.postKafka.producerSendMessage('test', 'test', 'user');

    return await this.fileUploadService.uploadSingle(image);
  }



  @Post('many')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image1: {
          type: 'string',
          format: 'binary',
        },
        image2:{
          type: 'string',
          format: 'binary',
        }
      },
    },
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'image1', maxCount: 1 },
      { name: 'image2', maxCount: 1 },
    ]),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Upload a multiple file or image'
  })
  async uploadMany(@UploadedFiles() files: BufferedFile) {
    return this.fileUploadService.uploadMany(files);
  }


  @Delete('removeOne')
  @ApiOperation({
    summary: 'Delete a file or image'
  })
  @ApiBody({
    schema: {
      properties: {
        fileName: {
          type: 'string'
        },
      },
    },
  })
  async remove(@Body("fileName") fileName: string) {
    return this.fileUploadService.deleteOne(fileName);
  }


  @Get('getAllFiles')
  @ApiOperation({
    summary: 'Get all files'
  })
  async getAll() {
    return this.fileUploadService.getAllFiles();
  }


  @Get('getAFile/:fileName')
  @ApiOperation({
    summary: 'Get a file'
  })
  // @ApiBody({
  //   schema: {
  //     properties: {
  //       fileName: {
  //         type: 'string'
  //       },
  //     },
  //   },
  // })
  async findbyFileName(@Param("fileName") fileName: string) {
   
    return this.fileUploadService.getAFileByFileName(fileName);
    
  }
}
