/*
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { I18nService } from 'nestjs-i18n';
import { FacilityTopics } from '../const/kafta.topic.enum';
import { checkObjectIddİsValid } from '../func/objectId.check';
import { KafkaService } from '../queueService/kafkaService';
import { PostKafka } from '../queueService/post-kafka';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  postKafka;
  constructor() {
    this.postKafka = new PostKafka(new KafkaService());
  }

  private readonly i18n: I18nService;
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url } = request;
    const userAgent = request.get('user-agent') || '';
    const query = request.params;

    const requestInformation = {
      timestamp: new Date(),
      path: request.url,
      method: request.method,
      body: request.body,
      userToken: request.headers['authorization'] || null,
    };
    const now = Date.now();

    response.on('close', async () => {
      const { statusCode, statusMessage } = response;
      const responseInformation = {
        statusCode,
        statusMessage,
        responseTime: `${Date.now() - now} ms`,
      };
      const log = { requestInformation, responseInformation };
      //  console.log(JSON.stringify(logg));
      try {
        await this.postKafka.producerSendMessage(
          FacilityTopics.FACILITY_LOGGER,
          JSON.stringify(log),
        );
        console.log('FACILITY_LOGGER topic send succesful');
      } catch (error) {
        console.log('FACILITY_LOGGER topic cannot connected due to ' + error);
      }
      this.logger.log(`${JSON.stringify(log)}   `);
    });

    next();
  }
}
*/
