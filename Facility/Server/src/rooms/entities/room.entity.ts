import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { BasePersistantDocumentObject } from 'ifmcommon';

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
   * Return class name(Room)
   */
  @Prop({
    type: String,
    default: function getClassName() {
      return Room.name;
    },
  })
  class_name: string;
}

/**
 * Room Schema
 */
export const RoomSchema = SchemaFactory.createForClass(Room);
