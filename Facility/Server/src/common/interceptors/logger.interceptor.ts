import { NestInterceptor, ExecutionContext, CallHandler, UseInterceptors, Logger, Request } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FacilityTopics } from '../const/kafta.topic.enum';
import { checkObjectIddİsValid } from '../func/objectId.check';
import { KafkaService } from '../queueService/kafkaService';
import { PostKafka } from '../queueService/post-kafka';
export function LoggerInter() {
  return UseInterceptors(new LoggingInterceptor());
}

export class LoggingInterceptor implements NestInterceptor {
  postKafka;
  constructor() {
    this.postKafka = new PostKafka(new KafkaService());
  }
  private logger = new Logger('HTTP');
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const query = request.params;
    const requestInformation = {
      timestamp: new Date(),
      path: request.url,
      method: request.method,
      body: request.body,
      //userToken: request.headers["authorization"] || null,
      user: request.user || null,
    };
    const now = Date.now();
    const url = request.url;
    const parsedUrl = url.match(/^\/[^\?\/]*/);
    const finalParsedUrl = request.method.toLowerCase() + parsedUrl[0].replace('/', '_');

    response.on('close', async () => {
      const { statusCode, statusMessage } = response;

      const responseInformation = {
        statusCode,
        statusMessage,
        responseTime: `${Date.now() - now} ms`,
      };
      const log = { requestInformation, responseInformation };
      try {
        await this.postKafka.producerSendMessage(FacilityTopics.FACILITY_LOGGER, JSON.stringify(log));
        console.log('FACILITY_LOGGER topic send succesful');
        //await this.postKafka.producerSendMessage(FacilityTopics.FACILITY_LOGGER, JSON.stringify(log));
      } catch (error) {
        console.log('FACILITY_LOGGER topic cannot connected due to ' + error);
      }
      this.logger.log(`${JSON.stringify(log)}   `);
    });
    if (query._id) {
      checkObjectIddİsValid(query._id);
    }
    return next.handle().pipe(
      tap(async (responseBody) => {
        try {
          if (request.method !== 'GET') {
            await this.postKafka.producerSendMessage(
              FacilityTopics.FACILITY_OPERATION,
              JSON.stringify(responseBody),
              finalParsedUrl,
            );
            console.log('Operetaion topic sen successfully');
          }
        } catch (error) {
          console.log(error);
        }
      }),
    );
  }
}
