import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { BasePersistantDocumentObject } from "../baseObject/base.object";

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
  @Prop()
  country: string;

  city: string;
  @Prop()
  address: string;
}

export const FaciliySchema = SchemaFactory.createForClass(Facility);
