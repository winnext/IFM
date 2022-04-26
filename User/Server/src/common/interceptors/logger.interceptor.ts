import { NestInterceptor, ExecutionContext, CallHandler, UseInterceptors, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserTopics } from '../const/kafta.topic.enum';
import { createReqLogObj } from '../func/generate.log.object';
import { checkObjectIddİsValid } from '../func/objectId.check';
import { KafkaService } from '../queueService/kafkaService';
import { PostKafka } from '../queueService/post-kafka';

/**
 * Decorator for interceptor to use fact in modules,controller
 */
export function LoggerInter() {
  return UseInterceptors(new LoggingInterceptor());
}

/**
 * Custom interceptor for log all endpoints and send this log to messagebroler  to save the database
 */
export class LoggingInterceptor implements NestInterceptor {
  /**
   * create variable for postKafka Service
   */
  postKafka: PostKafka;
  /**
   * create kafka service
   */
  constructor() {
    this.postKafka = new PostKafka(new KafkaService());
  }
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
    const query = request.params;
    const user: object = request.user;
    const method = request.method;
    const now = Date.now();
    const url = request.url;
    //this parsedUrl for the get which endpoints hit by user
    const parsedUrl = url.match(/^\/[^\?\/]*/)[0];
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
      try {
        await this.postKafka.producerSendMessage(UserTopics.USER_LOGGER, JSON.stringify(log));
        console.log('USER_LOGGER topic send succesful');
      } catch (error) {
        console.log('USER_LOGGER topic cannot connected due to ' + error);
      }
      this.logger.log(`${JSON.stringify(log)}   `);
    });
    if (query._id) {
      checkObjectIddİsValid(query._id);
    }
    return next.handle().pipe(
      tap(async (responseBody) => {
        try {
          const finalResponse = { responseBody, user, requestInformation };
          if (method !== 'GET') {
            await this.postKafka.producerSendMessage(
              UserTopics.USER_OPERATION,
              JSON.stringify(finalResponse),
              parsedUrl,
            );
            console.log('USER_OPERATION topic send successfully');
          }
        } catch (error) {
          console.log(error);
        }
      }),
    );
  }
}
