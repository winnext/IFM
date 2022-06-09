import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { BasePersistantDocumentObject } from 'ifmcommon';

export type AssetDocument = Asset & Document;

@Schema()
/**
 * Room Entity With Mongoose
 */
export class Asset extends BasePersistantDocumentObject {
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
      return Asset.name;
    },
  })
  class_name: string;
}

/**
 * Room Schema
 */
export const AssetSchema = SchemaFactory.createForClass(Asset);
