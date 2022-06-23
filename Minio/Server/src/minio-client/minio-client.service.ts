import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
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

  public async upload(file: BufferedFile,folderName?: string, baseBucket: string = this.baseBucket) {
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
    let fileName;
    if(folderName !=null) fileName = await `${folderName}/${filename}`;
    else {fileName = await `${filename}`;}
    const fileBuffer = await file.buffer;
    await this.client.putObject(baseBucket, fileName, fileBuffer, function (err, res) {
       if (err) throw new HttpException('Error uploading file 2', HttpStatus.BAD_REQUEST);

      console.log(res, "RESPONSEEEE");
      console.log(err, "ERRORRR");


    });
    // await this.client.putObject(baseBucket, fileName, fileBuffer, metadata).then(function (res){
    //   console.log(res, "RESPONSEEEE");
    // })
    return {
      url: `http://${process.env.MINIO_ENDPOINT}:9000/${process.env.MINIO_BUCKET}/${fileName}`,
    };
  }

  public async delete(fileName:string,baseBucket: string = this.baseBucket){
    await this.client.removeObject(baseBucket,fileName,function(err){
      if(err) console.log(err);
      return `${fileName} successfully deleted`
     
    });
  }

  public async getAObject(fileName:string,baseBucket: string = this.baseBucket){
    let data = [];
   
    const promise = new Promise((resolve, reject) =>{
      this.client.getObject(baseBucket, fileName).then(function(dataStream){
      dataStream.on('data',async function(value){
      data.push(value)
      })
        dataStream.on('end', function(){

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

  public async getAllObjects(baseBucket: string){
    let data = [];
    const promise = new Promise((resolve, reject) =>{
      let stream =this.client.listObjects(baseBucket)
      stream.on('data',async function(value){
      data.push(value)
      })
        stream.on('end', function(){
      resolve(data)
      })
        stream.on('error', function(err) {
        console.log(err)
        reject(err)
    })
    })
  
   return promise
      
  }

  public async getAllObjectsWithPrefix(baseBucket: string,prefix: string){
    let data = [];
    prefix = await prefix+"/";
    const promise = new Promise((resolve, reject) =>{
      let stream =this.client.listObjects(baseBucket,prefix)
      stream.on('data',async function(value){
      data.push(value)
      })
        stream.on('end', function(){
      resolve(data)
      })
        stream.on('error', function(err) {
        console.log(err)
        reject(err)
    })
    })
  
   return promise
      
  }

  public async createBucket(bucketName:string){
   await this.client.makeBucket(bucketName,'us-east-1',function(err){
    if(err) console.log(err)
    console.log(`named${bucketName} bucket created`)
   });
  }
 }


