import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { BasePersistantDocumentObject } from 'src/common/baseObject/base.object';

export type UserDocument = User & Document;

@Schema()
export class User extends BasePersistantDocumentObject {
  @Prop({ unique: true })
  userId: string;

  @Prop()
  phone_number: string;

  @Prop({
    type: Date,
    default: function genDate() {
      return new Date();
    },
  })
  createdAt: Date;

  @Prop({
    type: Date,
    default: function genDate() {
      return new Date();
    },
  })
  updatedAt: Date;

  @Prop({
    type: String,
    default: function getClassName() {
      return User.name;
    },
  })
  class_name: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
