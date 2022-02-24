import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
  OnModuleInit,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

import { Facility } from "src/facility/entities/facility.entity";
import { KafkaService } from "../queueService/kafkaService";
import { PostKafka } from "../queueService/post-kafka";

export function LoggerInter() {
  return UseInterceptors(new LoggingInterceptor());
}

export class LoggingInterceptor implements NestInterceptor, OnModuleInit {
  postKafka = new PostKafka(new KafkaService());
  async onModuleInit() {
    await this.postKafka.producer.connect();
    console.log("connected to producer");
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const methodKey = context.getHandler().name; // "create" //method name
    const className = context.getClass().name; // "FacilityCOntroller"

    const requestInformation = {
      timestamp: new Date(),
      path: request.url,
      method: request.method,
      body: request.body,
      userToken: request.headers["authorization"] || null,
      methodKey: methodKey,
      className: className,
    };

    

    console.log(requestInformation);
    //send request informations to kafka topic

    console.log(response)

    try {
      await this.postKafka.producerTest(
        Facility.name,
        JSON.stringify(requestInformation)
      );
      console.log("message sent to queue");
    } catch (error) {
      console.log("something goes wrong error is = " + error);
    }

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
