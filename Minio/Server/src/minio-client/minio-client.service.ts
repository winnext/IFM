import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { Stream } from 'stream';
import { config } from './config';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';

@Injectable()
export class MinioClientService {
  private readonly logger: Logger;
  private readonly baseBucket = process.env.MINIO_BUCKET;

  public get client() {
    return this.minio.client;
  }

  constructor(private readonly minio: MinioService) {
    this.logger = new Logger('MinioStorageService');
  }

  public async upload(file: BufferedFile, baseBucket: string = this.baseBucket) {
    console.log(file);
    //check the file type is jpeg or png or pdf or excel file
    if (
      !(
        file.mimetype.includes('jpeg') ||
        file.mimetype.includes('png') ||
        file.mimetype.includes('pdf') ||
        file.mimetype.includes('excel')
      )
    ) {
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
    }
    const temp_filename = Date.now().toString();
    const hashedFileName = crypto.createHash('md5').update(temp_filename).digest('hex');
    const ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    const metaData = {
      'Content-Type': file.mimetype,
      'X-Amz-Meta-Testing': 1234,
    };
    const filename = hashedFileName + ext;
    const fileName = `${filename}`;
    const fileBuffer = file.buffer;
    const x = await this.client.putObject(baseBucket, fileName, fileBuffer, function (err, res) {
      if (err) throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST);
      console.log(res);
    });

    return {
      url: `${config.MINIO_ENDPOINT}:9001/${config.MINIO_BUCKET}/${filename}`,
    };
  }
}
