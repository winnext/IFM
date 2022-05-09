import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Document } from 'mongoose';

export type FacilityStructureDocument = FacilityStructureHistory & Document;

@Schema()
export class FacilityStructureHistory {
  @Prop({ type: Object })
  facilityStructure: object;

  @Prop({ type: Object })
  user: object;

  @Prop({ type: Object })
  requestInformation: object;
}

export const FaciliyStructureHistorySchema = SchemaFactory.createForClass(FacilityStructureHistory);
