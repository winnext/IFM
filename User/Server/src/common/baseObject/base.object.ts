import { Document } from 'mongoose';

/**
 * Base object for entities whic inherit mongoose document meytods
 */
export abstract class BasePersistantDocumentObject extends Document {
  /**
   * Uuid for uniqeness
   */
  uuid: string;
  /**
   * location
   */
  locations: string;
  /**
   * isActive
   */
  isActive: boolean;
  /**
   * isDeleted
   */
  isDeleted: boolean;
}
