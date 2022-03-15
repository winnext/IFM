import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Timestamp } from 'bson';
import { Document } from 'mongoose';
import { BasePersistantDocumentObject } from 'src/common/baseObject/base.object';
import { v4 as uuidv4 } from 'uuid';
import { Adress } from './facility.address';

export type FacilityDocument = Facility & Document;

@Schema()
export class Facility extends BasePersistantDocumentObject {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  })
  uuid: string;

  @Prop()
  facility_name: string;

  @Prop()
  locations: string;

  @Prop()
  brand_name: string;
  @Prop()
  type_of_facility: string;
  @Prop()
  classification_of_facility: object[];
  @Prop([String])
  label: string[];

  @Prop({
    type: Timestamp,
    default: function genDate() {
      return new Date();
    },
  })
  createdAt: Timestamp;

  @Prop()
  updatedAt: Timestamp;

  @Prop()
  address: Adress[];

  @Prop({
    type: String,
    default: function getClassName() {
      return Facility.name;
    },
  })
  class_name: string;
}

export const FaciliySchema = SchemaFactory.createForClass(Facility);
