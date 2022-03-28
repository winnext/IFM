import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BasePersistantDocumentObject } from 'src/common/baseObject/base.object';
import { v4 as uuidv4 } from 'uuid';
import { Document, Schema as MongooseSchema } from 'mongoose';
export type FacilityStructureDocument = FacilityStructure & Document;
@Schema()
export class FacilityStructure extends BasePersistantDocumentObject {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  })
  uuid: string;
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
  @Prop({ type: Object })
  structure: object;
  @Prop()
  facility_id: string;
}

export const FaciliyStructureSchema = SchemaFactory.createForClass(FacilityStructure);
