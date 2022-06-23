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
        folderName:{ type: 'string'}
      },
    },
  })
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({
    summary: 'Upload a single file or image'
  })
  @ApiConsumes('multipart/form-data')
  async uploadSingle(@UploadedFile() image: BufferedFile,@Body("folderName") folderName?:string) {
    //const x = await this.postKafka.producerSendMessage('test', 'test', 'user');

    return await this.fileUploadService.uploadSingle(image,folderName);
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
        },
        folderName:{ type: 'string'}
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
    summary: 'Upload multiple file or image'
  })
  async uploadMany(@UploadedFiles() files: BufferedFile,@Body("folderName") folderName: string) {
    return this.fileUploadService.uploadMany(files,folderName);
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


  @Get('getAllFiles/:bucketName')
  @ApiOperation({
    summary: 'Get all files'
  })
  async getAll(@Param('bucketName') bucketName: string) {
    return this.fileUploadService.getAllFiles(bucketName);
  }

  @Get('getAllFilesWithPrefix/:bucketName/:prefix')
  @ApiOperation({
    summary: 'Get all files with prefix'
  })
  async getAllWithPrefix(@Param('bucketName') bucketName: string,@Param("prefix") prefix: string) {
    return this.fileUploadService.getAllFiles(bucketName,prefix);
  }

  @Get('getAFile/:fileName')
  @ApiOperation({
    summary: 'Get a file'
  })
  async findbyFileName(@Param("fileName") fileName: string) {
    return this.fileUploadService.getAFileByFileName(fileName);
  }


  @Post("createBucket/:bucketName")
  @ApiOperation({
    summary: 'Enter a bucket name'
  })
  async createBucket(@Param("bucketName") bucketName: string) {

    return this.fileUploadService.createBucket(bucketName);
  }
}
