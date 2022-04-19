import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { PostKafka } from '../queueService/post-kafka';
export declare function LoggerInter(): MethodDecorator & ClassDecorator;
export declare class LoggingInterceptor implements NestInterceptor {
    postKafka: PostKafka;
    constructor();
    private logger;
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
