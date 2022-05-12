import { NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { KafkaConfig } from 'kafkajs';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { createReqLogObj } from '../func/generate.log.object';
import { checkObjectIddİsValid } from '../func/objectId.check';

/**
 * Decorator for interceptor to use fact in modules,controller
 */

/**
 * Custom interceptor for log all endpoints and send this log to messagebroler  to save the database
 */
export class LoggingInterceptor implements NestInterceptor {
  /**
   * Log from Logger
   */
  private logger = new Logger('HTTP');

  /**
   * Intercept method implements from NestInterceptor
   */
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const now = Date.now();
    const url = request.url;

    // this event triggered when request is and response is done
    const requestInformation = createReqLogObj(request);
    response.on('close', async () => {
      const { statusCode, statusMessage } = response;

      const responseInformation = {
        statusCode,
        statusMessage,
        responseTime: `${Date.now() - now} ms`,
      };

      const log = { requestInformation, responseInformation };
      this.logger.log(`${JSON.stringify(log)}   `);
    });

    return next.handle().pipe(
      tap(async (responseBody) => {
        console.log(responseBody);
      }),
    );
  }
}
