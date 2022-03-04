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
import { checkObjectIddİsValid } from "../func/objectId.check";
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
    const request = ctx.getRequest();
    const methodKey = context.getHandler().name; // "create" //method name
    const className = context.getClass().name; // "FacilityCOntroller"
    const query = request.params;

     if (query._id) {
       checkObjectIddİsValid(query._id);
     }

  

    // console.log(requestInformation);
    //send request informations to kafka topic
  
   
//request resoense log birleştirilecek
    
    return next
      .handle()
      .pipe(tap())
  }
}
