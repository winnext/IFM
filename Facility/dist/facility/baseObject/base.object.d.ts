import { Document } from 'mongoose';
export declare abstract class BasePersistantDocumentObject extends Document {
    uuid: string;
    locations: string;
}
