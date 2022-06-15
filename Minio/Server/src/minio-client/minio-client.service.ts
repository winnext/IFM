import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { BufferedFile } from './file.model';
import * as crypto from 'crypto';
import fs from 'fs';

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
      throw new HttpException('Error Check the file type is jpeg or png or excel', HttpStatus.BAD_REQUEST);
    }
    const temp_filename = await Date.now().toString();
    const hashedFileName = await crypto.createHash('md5').update(temp_filename).digest('hex');
    const ext = await file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
    const filename =  await hashedFileName + ext;
    const fileName = await `${filename}`;
    const fileBuffer = await file.buffer;
    await this.client.putObject(baseBucket, fileName, fileBuffer, function (err, res) {
       if (err) throw new HttpException('Error uploading file 2', HttpStatus.BAD_REQUEST);

      console.log(res, "RESPONSEEEE");
      console.log(err, "ERRORRR");


    });

    return {
      url: `${process.env.MINIO_ENDPOINT}:9001/${process.env.MINIO_BUCKET}/${filename}`,
    };
  }

  public async delete(fileName:string,baseBucket: string = this.baseBucket){
    await this.client.removeObject(baseBucket,fileName,function(err){
      if(err) console.log(err);
      return `${fileName} successfully deleted`
     
    });
  }

  public async getAllObjects(baseBucket: string = this.baseBucket){
    var data = []
var stream = this.client.listObjects(baseBucket,'', true)
stream.on('data', function(obj) { data.push(obj) } )
stream.on("end", function (obj) { console.log(data) })
stream.on('error', function(err) { console.log(err) } )
  }

  public async getAObject(fileName:string,baseBucket: string = this.baseBucket){
    let data = [];
   
    const promise = new Promise((resolve, reject) =>{
      this.client.getObject(baseBucket, fileName).then(function(dataStream){
      dataStream.on('data',async function(chunk){
      data.push(chunk)
      //size += chunk.length
      })
        dataStream.on('end', function(){
        //console.log("total size: " + size)
      resolve(data)
      })
        dataStream.on('error', function(err) {
        console.log(err)
        reject(err)
    })
    }).catch(reject)
  })
   return promise
      
  }

// public async getFile(fileName:string,baseBucket: string = this.baseBucket){

//   await this.client.fGetObject(baseBucket,fileName, `/Users/berkaybozkurt/Downloads/${fileName}`, function(err) {
//     if (err) {
//       return console.log(err)
//     }
//   })
  
//   return {message:`${fileName} successfully downloaded`,statusCode:200}
// }
 }


