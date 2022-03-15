import { I18nService } from 'nestjs-i18n';
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { I18NEnums } from '../const/i18n.enum';
import { KafkaService } from '../queueService/kafkaService';
import { PostKafka } from '../queueService/post-kafka';
import { FacilityTopics } from '../const/kafta.topic.enum';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  postKafka;

  constructor(private readonly i18n: I18nService) {
    this.postKafka = new PostKafka(new KafkaService());
  }
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const requestInformation = {
      timestamp: new Date(),
      user: request.user || null,
      path: request.url,
      method: request.method,
      body: request.body,
    };

    const errorResponseLog = {
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      status,
      message: exception.message,
    };
    switch (exception.getStatus()) {
      case 400:
        try {
          const finalExcep = {
            errorResponseLog,
            requestInformation,
          };
          await this.postKafka.producerSendMessage(FacilityTopics.FACILITY_EXCEPTIONS, JSON.stringify(finalExcep));
          response.status(status).json(exception.getResponse());
        } catch (error) {
          console.log('FACILITY_EXCEPTION topic cannot connected due to ' + error);
        }
        break;
      case 401:
        try {
          const message = await getI18nMessage(this.i18n, request);
          const clientResponse = { status, message };
          const finalExcep = {
            errorResponseLog,
            clientResponse,
            requestInformation,
          };
          await this.postKafka.producerSendMessage(FacilityTopics.FACILITY_EXCEPTIONS, JSON.stringify(finalExcep));
          response.status(status).json(clientResponse);
        } catch (error) {
          console.log('FACILITY_EXCEPTION topic cannot connected due to ' + error);
        }
        break;
      case 403:
        try {
          const message = await getI18nMessage(this.i18n, request);
          const clientResponse = { status, message };
          const finalExcep = {
            errorResponseLog,
            clientResponse,
            requestInformation,
          };
          await this.postKafka.producerSendMessage(FacilityTopics.FACILITY_EXCEPTIONS, JSON.stringify(finalExcep));
          response.status(status).json(clientResponse);
        } catch (error) {
          console.log('FACILITY_EXCEPTION topic cannot connected due to ' + error);
        }
        break;
      case 404:
        const result: any = exception.getResponse();
        try {
          const message = await this.i18n.translate(result.key, {
            lang: ctx.getRequest().i18nLang,
            args: result.args,
          });

          const clientResponse = { status, message };
          const finalExcep = {
            errorResponseLog,
            clientResponse,
            requestInformation,
          };
          await this.postKafka.producerSendMessage(FacilityTopics.FACILITY_EXCEPTIONS, JSON.stringify(finalExcep));
          console.log(`FACILITY_EXCEPTION sending to topic`);
          response.status(status).json(clientResponse);
        } catch (error) {
          console.log(error);
        }
        break;

      default:
        response.status(status).json(exception.message);
        break;
    }
  }
}

async function getI18nMessage(i18n: I18nService, request) {
  const username = request.user?.preferred_name || 'Guest';
  return await i18n.translate(I18NEnums.USER_NOT_HAVE_PERMISSION, {
    lang: request.i18nLang,
    args: { username },
  });
}
