import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BasePersistantDocumentObject } from 'src/common/baseObject/base.object';
import { Facility } from 'src/facility/entities/facility.entity';
import { v4 as uuidv4 } from 'uuid';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Timestamp } from 'bson';
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
  @Prop()
  name: string;
  @Prop({
    type: Timestamp,
    default: function genDate() {
      return new Date();
    },
  })
  createdAt: Timestamp;
  @Prop()
  updatedAt: Timestamp;
  @Prop({ type: Object })
  structure: object;
  @Prop({ type: Object })
  address: object;
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Facility.name })
  facility_id: Facility;
}

export const FaciliyStructureSchema = SchemaFactory.createForClass(FacilityStructure);
