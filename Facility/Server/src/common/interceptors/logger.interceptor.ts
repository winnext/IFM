import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
  OnModuleInit,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { checkObjectIddİsValid } from "../func/objectId.check";
export function LoggerInter() {
  return UseInterceptors(new LoggingInterceptor());
}

export class LoggingInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const query = request.params;

    if (query._id) {
      checkObjectIddİsValid(query._id);
    }
    return next.handle().pipe(tap());
  }
}
