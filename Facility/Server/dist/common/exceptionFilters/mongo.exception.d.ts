import { ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';
export declare class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: MongoError): void;
}
