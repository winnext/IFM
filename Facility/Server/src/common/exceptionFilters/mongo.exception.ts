import {
  BadGatewayException,
  Catch,
  ConflictException,
  ExceptionFilter,
  InternalServerErrorException,
} from '@nestjs/common';
import { MongoError } from 'mongodb';

@Catch(MongoError)
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: MongoError) {
    switch (exception.code) {
      case 112: // write conflict (when a transaction is failed)
        throw new BadGatewayException();
      case 211: // MONGO CONNECTİON LOST exception
        throw new InternalServerErrorException();
      case 11600: // MONGO CONNECTİON LOST exception
        throw new InternalServerErrorException();
      case 11000: // duplicate exception
        throw new ConflictException();
      default:
        throw new InternalServerErrorException(`error ${exception.code}`);
    }
  }
}
