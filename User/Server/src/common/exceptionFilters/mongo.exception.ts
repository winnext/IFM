import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { MongoError } from 'mongodb';

/**
 * Catch MongoException and send this exception to messagebroker  to save the database
 */
@Catch()
export class MongoExceptionFilter implements ExceptionFilter {
  /**
   * Catch Method For Mongo Error
   */
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    console.log('--------This error from MONGO EXCEPTİPON FİLTER-----------');
    console.log(exception);

    switch (exception.code) {
      case 112: // write conflict (when a transaction is failed)
        response.status(409).json({ code: 409, message: 'conflict' });
        break;
      case 211: // MONGO CONNECTİON LOST exception
        response.status(500).json({ code: 500, message: 'Server down' });
        break;
      case 11000: // duplicate exception
        response.status(400).json({ code: 409, message: 'Duplicate entry' });
        break;
      case 11600: // MONGO CONNECTİON LOST exception
        response.status(500).json({ code: 500, message: 'Server connection lost' });
        break;
      default:
        response.status(500).json({ code: 500, message: 'Internal server error' });
        break;
    }
  }
}