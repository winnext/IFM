import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Document } from 'mongoose';

export type TreeHistoryDocument = TreeHistory & Document;

@Schema()
export class TreeHistory {
  @Prop({ type: Object })
  classification: object;

  @Prop({ type: Object })
  user: object;

  @Prop({ type: Object })
  requestInformation: object;
}

export const TreeHistorySchema = SchemaFactory.createForClass(TreeHistory);
