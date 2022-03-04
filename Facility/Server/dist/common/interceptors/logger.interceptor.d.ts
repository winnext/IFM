import { NestInterceptor, ExecutionContext, CallHandler, OnModuleInit } from "@nestjs/common";
import { Observable } from "rxjs";
import { PostKafka } from "../queueService/post-kafka";
export declare function LoggerInter(): MethodDecorator & ClassDecorator;
export declare class LoggingInterceptor implements NestInterceptor, OnModuleInit {
    postKafka: PostKafka;
    onModuleInit(): Promise<void>;
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
