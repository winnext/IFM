import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { Classification } from 'src/classification/entities/classification.entity';
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
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: Classification.name }])
  classifications: Classification[];
  @Prop([String])
  label: string[];

  @Prop({ type: Object })
  pathToChosenNodeClassification: object;
  @Prop({
    type: Date,
    default: function genDate() {
      return new Date();
    },
  })
  createdAt: Date;

  @Prop()
  updatedAt: Date;

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
