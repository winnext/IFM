import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { BasePersistantDocumentObject } from 'ifmcommon';
import { ClassificationDetail } from './classification.detail';
import { Adress } from './facility.address';

export type FacilityDocument = Facility & Document;

@Schema()
export class Facility extends BasePersistantDocumentObject {
  @Prop()
  facility_name: string;

  @Prop()
  locations: string;

  @Prop()
  brand_name: string;
  @Prop()
  type_of_facility: string;
  @Prop()
  classifications: ClassificationDetail[];
  @Prop([String])
  label: string[];

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
