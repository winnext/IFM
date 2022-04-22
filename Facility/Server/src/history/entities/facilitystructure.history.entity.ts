import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Document } from 'mongoose';
import { BasePersistantDocumentObject } from 'src/common/baseObject/base.object';

export type FacilityStructureDocument = FacilityStructureHistory & Document;

@Schema()
export class FacilityStructureHistory extends BasePersistantDocumentObject {
  @Prop({ type: Object })
  facilityStructure: object;

  @Prop({ type: Object })
  user: object;

  @Prop({ type: Object })
  requestInformation: object;
}

export const FaciliyStructureHistorySchema = SchemaFactory.createForClass(FacilityStructureHistory);
