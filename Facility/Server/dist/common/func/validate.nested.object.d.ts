import { ValidationOptions } from 'class-validator';
export declare function ValidateNested(schema: new () => any, validationOptions?: ValidationOptions): (object: Object, propertyName: string) => void;
