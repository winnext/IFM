import { SchemaFactory } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';


export class Classification {
  
  key: string =  generateUuid();
  code: string;
  name: string;
  tag: string[];
  label: string;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  hasParent: Boolean = true;
}

function generateUuid() {
    return uuidv4()
}

export const ClassificationSchema = SchemaFactory.createForClass(Classification);  //Silinecek