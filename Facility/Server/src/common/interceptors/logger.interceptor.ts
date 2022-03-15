import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
  OnModuleInit,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { FacilityTopics } from "../const/kafta.topic.enum";
import { checkObjectIddİsValid } from "../func/objectId.check";
import { KafkaService } from "../queueService/kafkaService";
import { PostKafka } from "../queueService/post-kafka";
export function LoggerInter() {
  return UseInterceptors(new LoggingInterceptor());
}

export class LoggingInterceptor implements NestInterceptor {
  postKafka;
  constructor() {
    this.postKafka = new PostKafka(new KafkaService());
  }
  private logger = new Logger("HTTP");
  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const query = request.params;

    const requestInformation = {
      timestamp: new Date(),
      path: request.url,
      method: request.method,
      body: request.body,
      userToken: request.headers["authorization"] || null,
    };
    const now = Date.now();
   

    response.on("close", async () => {
      const { statusCode, statusMessage } = response;
      const responseInformation = {
        statusCode,
        statusMessage,
        responseTime: `${Date.now() - now} ms`,
      };
      const log = { requestInformation, responseInformation };
      try {
        await this.postKafka.producerSendMessage(
          FacilityTopics.FACILITY_LOGGER,
          JSON.stringify(log)
        );
        console.log("FACILITY_LOGGER topic send succesful");
      } catch (error) {
        console.log("FACILITY_LOGGER topic cannot connected due to " + error);
      }
      this.logger.log(`${JSON.stringify(log)}   `);
    });
    if (query._id) {
      checkObjectIddİsValid(query._id);
    }
    return next.handle().pipe(tap());
  }
}
