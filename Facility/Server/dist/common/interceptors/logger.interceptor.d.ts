import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare function LoggerInter(): MethodDecorator & ClassDecorator;
export declare class LoggingInterceptor implements NestInterceptor {
    postKafka: any;
    constructor();
    private logger;
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
