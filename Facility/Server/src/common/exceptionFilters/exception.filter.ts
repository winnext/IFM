import { I18nService } from "nestjs-i18n";
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  OnModuleInit,
  OnModuleDestroy,
} from "@nestjs/common";
import { Request, Response } from "express";
import { I18NEnums } from "../const/i18n.enum";
import { KafkaService } from "../queueService/kafkaService";
import { PostKafka } from "../queueService/post-kafka";
import { log } from "console";
import { FacilityTopics } from "../const/kafta.topic.enum";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
   postKafka;
  constructor(private readonly i18n: I18nService) {
    this.postKafka = new PostKafka(new KafkaService());
  }
  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponseLog = {
      
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
    };
    switch (exception.getStatus()) {
      case 401:
        try {
          const message = await this.i18n.translate(
            I18NEnums.USER_NOT_HAVE_PERMISSION,
            { 
              lang: ctx.getRequest().i18nLang,
              args: { username: "Test User" },
            }
          );
          const clientResponse={ status: status, message }
          
          await this.postKafka.producerSendMessage(
            FacilityTopics.FACILITY_EXCEPTIONS,
            JSON.stringify({...errorResponseLog,...clientResponse})
          );
         
          response.status(status).json(clientResponse);
        } catch (error) {
          console.log("FACILITY_EXCEPTION topic cannot connected due to " + error);
        }
        break;
      case 404:
        let result: any = exception.getResponse();
        try {
          result = await this.i18n.translate(result.key, {
            lang: ctx.getRequest().i18nLang,
            args: result.args,
          });
          const clientResponse={ status: status, result }
          await this.postKafka.producerSendMessage(
            FacilityTopics.FACILITY_EXCEPTIONS,
            JSON.stringify({...errorResponseLog,...clientResponse})
          );
          console.log(`FACILITY_EXCEPTION sending to topic`)
        } catch (error) {
          console.log(error);
        }

        typeof result === "string"
          ? response.status(status).json({ status: status, message: result })
          : response.status(status).json({ status, message: result.message });
        break;

      default:
        break;
    }


    /*
    if(exception.getStatus()===404){
        let result: any = exception.getResponse();
    try {
      result = await this.i18n.translate(result.key, {
        lang: ctx.getRequest().i18nLang,
        args: result.args,
      });
    } catch (error) {
        console.log(error)
    }

    typeof result === "string"
      ? response.status(status).json({ status: status, message: result })
      : response.status(status).json({ status, message: result.message });
    }else{
        let result: any = exception.getResponse();
        try {
          const message= await this.i18n.translate(I18NEnums.USER_NOT_HAVE_PERMISSION, {
              lang:ctx.getRequest().i18nLang,
              args: { username: 'Toon' },
            }); 
            console.log(message)
            response.status(status).json({ status: status, message})
        } catch (error) {
            console.log(error)
        }
    }
*/

    //response.status(status).json( statusMessage );
  }
}
