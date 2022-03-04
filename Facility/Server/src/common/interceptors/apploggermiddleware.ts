import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url } = request;
    const userAgent = request.get('user-agent') || '';

    const requestInformation = {
        timestamp: new Date(),
        path: request.url,
        method: request.method,
        body: request.body,
        userToken: request.headers["authorization"] || null,
       
      };
      const now=Date.now()

    response.on('close', () => {
      const { statusCode,statusMessage, } = response;
      const responseInformation={
          statusCode,
          statusMessage,
          responseTime:`${Date.now()-now} ms`

      }
     const logg={requestInformation,responseInformation}
     console.log(JSON.stringify(logg))

      this.logger.log(
        `${logg}   `
      );
    });

    next();
  }
}