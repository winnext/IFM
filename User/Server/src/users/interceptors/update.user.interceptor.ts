import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { User } from '../entities/user.entity';

@Injectable()
//this interceptor block to user to update userId property
export class UpdateUserInterceptor implements NestInterceptor {
  public intercept(_context: ExecutionContext, next: CallHandler): Observable<User> {
    // changing request
    const request = _context.switchToHttp().getRequest();
    if (request.body.userId) {
      delete request.body.userId;
    }

    return next.handle().pipe(
      map((flow) => {
        return flow;
      }),
    );
  }
}
