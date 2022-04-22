import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { BasePersistantDocumentObject } from 'src/common/baseObject/base.object';
import { Languages } from 'src/common/const/language.enum';
import { genCurrentDate } from 'src/common/func/generate.new.date';

export type RoomDocument = Room & Document;

@Schema()
/**
 * Room Entity With Mongoose
 */
export class Room extends BasePersistantDocumentObject {
  /**
   * Room Code
   */
  @Prop()
  code: string;
  /**
   * createDate of room
   */
  @Prop({
    type: Date,
    default: genCurrentDate(),
  })
  createdAt: Date;

  /**
   * updateDate of room when created
   */
  @Prop({
    type: Date,
    default: genCurrentDate(),
  })
  updatedAt: Date;

  /**
   * Return class name(Room)
   */
  @Prop({
    type: String,
    default: function getClassName() {
      return Room.name;
    },
  })
  class_name: string;

  /**
   * is room deleted(true or false)
   */
  @Prop({ default: false })
  isDeleted: boolean;

  /**
   * is room active(true or false)
   */
  @Prop({ default: true })
  isActive: boolean;
}

/**
 * Room Schema
 */
export const RoomSchema = SchemaFactory.createForClass(Room);
