import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Document } from 'mongoose';
export type AssetDocument = AssetHistory & Document;

/**
 * Create User  History Entity with Mongoose
 */
@Schema()
export class AssetHistory {
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
export const AssetHistorySchema = SchemaFactory.createForClass(AssetHistory);
