import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Document } from 'mongoose';

export type FacilityDocument = FacilityHistory & Document;

@Schema()
export class FacilityHistory {
  @Prop({ type: Object })
  facility: object;

  @Prop({ type: Object })
  user: object;

  @Prop({ type: Object })
  requestInformation: object;
}

export const FaciliyHistorySchema = SchemaFactory.createForClass(FacilityHistory);
