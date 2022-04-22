import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Document } from 'mongoose';
import { BasePersistantDocumentObject } from 'src/common/baseObject/base.object';

export type RoomDocument = RoomHistory & Document;

/**
 * Create User  History Entity with Mongoose
 */
@Schema()
export class RoomHistory extends BasePersistantDocumentObject {
  /**
   * user object
   */
  @Prop({ type: Object })
  user: object;

  /**
   * user object from keycloak from incoming request
   */
  @Prop({ type: Object })
  room: object;

  /**
   * room request object from incoming request
   */
  @Prop({ type: Object })
  requestInformation: object;
}

/**
 * User Historu Schema for Mongoose
 */
export const RoomHistorySchema = SchemaFactory.createForClass(RoomHistory);
