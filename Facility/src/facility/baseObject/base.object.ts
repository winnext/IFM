import { Document } from 'mongoose';

export abstract class BasePersistantDocumentObject extends Document {
  uuid: string;
  locations: string;
}
