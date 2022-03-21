import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Document } from 'mongoose';
import { BasePersistantDocumentObject } from 'src/common/baseObject/base.object';

export type ClassificationHİstoryDocument = ClassificationHistory & Document;

@Schema()
export class ClassificationHistory extends BasePersistantDocumentObject {
  @Prop({ type: Object })
  classification: object;
}

export const ClassificationHistorySchema = SchemaFactory.createForClass(ClassificationHistory);
ClassificationHistory;
