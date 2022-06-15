import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { BufferedFile } from 'src/minio-client/file.model';

@Injectable()
export class FileUploadService {
  constructor(private minioClientService: MinioClientService) {}

  async uploadSingle(image: BufferedFile) {
    try {
      let uploaded_image = await this.minioClientService.upload(image);
      if(!uploaded_image.url){
        throw new HttpException("Error, Check the file type is jpeg or png or excel",HttpStatus.BAD_REQUEST)
      }
      return {
        image_url: uploaded_image.url,
        message: 'Successfully uploaded to MinIO S3',
      };
    } catch (error) {
      throw new HttpException({message:error.message,statusCode:HttpStatus.BAD_REQUEST},HttpStatus.BAD_REQUEST)
    }
  }

  async uploadMany(files: BufferedFile) {
    let image1 = files['image1'][0];
    let uploaded_image1 = await this.minioClientService.upload(image1);

    let image2 = files['image2'][0];
    let uploaded_image2 = await this.minioClientService.upload(image2);

    return {
      image1_url: uploaded_image1.url,
      image2_url: uploaded_image2.url,
      message: 'Successfully uploaded mutiple image on MinioS3',
    };
  }

  async deleteOne(fileName: string){
    let res=await this.minioClientService.delete(fileName);
    return res;
  }

  async getAllFiles(){
    let res= await this.minioClientService.getAllObjects();
    return res;
  }

  async getAFileByFileName(fileName:string){
    let res= await this.minioClientService.getAObject(fileName);
   return res;
  }
}
