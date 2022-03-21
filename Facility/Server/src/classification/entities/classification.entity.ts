import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type ClassificationDocument = Classification & Document;

@Schema()
export class Classification extends Document {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  })
  uuid: string;

  @Prop()
  code: string;

  @Prop()
  name: string;

  @Prop({
    type: String,
    default: function getClassName() {
      return Classification.name;
    },
  })
  class_name: string;

  @Prop({ type: Object })
  detail: object;

  @Prop({
    type: Date,
    default: function genDate() {
      return new Date();
    },
  })
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ClassificationSchema = SchemaFactory.createForClass(Classification);
