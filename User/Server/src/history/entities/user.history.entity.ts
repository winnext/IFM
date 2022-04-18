import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Document } from 'mongoose';
import { BasePersistantDocumentObject } from 'src/common/baseObject/base.object';

export type UserDocument = UserHistory & Document;

/**
 * Create User  History Entity with Mongoose
 */
@Schema()
export class UserHistory extends BasePersistantDocumentObject {
  /**
   * user object
   */
  @Prop({ type: Object })
  user: object;

  /**
   * user object from keycloak from incoming request
   */
  @Prop({ type: Object })
  keycloack_user: object;
}

/**
 * User Historu Schema for Mongoose
 */
export const UserHistorySchema = SchemaFactory.createForClass(UserHistory);
