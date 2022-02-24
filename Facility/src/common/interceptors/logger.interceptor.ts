import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Logger } from "@nestjs/common";


export function LoggerInter() {
  return UseInterceptors(new LoggingInterceptor());
}

export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestInformation = {
      timestamp: new Date().toLocaleDateString(),
      path: request.url,
      method: request.method,
      body: request.body,
    };
    console.log(test);

    Logger.debug(requestInformation);

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
