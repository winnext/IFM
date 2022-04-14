import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Document } from 'mongoose';
import { BasePersistantDocumentObject } from 'src/common/baseObject/base.object';

export type UserDocument = UserHistory & Document;

@Schema()
export class UserHistory extends BasePersistantDocumentObject {
  @Prop({ type: Object })
  user: object;

  @Prop({ type: Object })
  keycloack_user: object;
}

export const UserHistorySchema = SchemaFactory.createForClass(UserHistory);
