import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { Neo4jError } from 'neo4j-driver';
import { ExceptionType } from '../const/exception.type';
import { createExceptionReqResLogObj } from '../func/generate.exception.logobject';

@Catch(Neo4jError)
export class Neo4jErrorFilter implements ExceptionFilter {
  catch(exception: Neo4jError, host: ArgumentsHost) {
    console.log('------------------Neo4jErrorFilter------------------');
    console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let statusCode = 500;
    let error = 'Internal Server Error';
    let message: string[] = [];
    const reqResObject = createExceptionReqResLogObj(request, exception, ExceptionType.NEO4J_EXCEPTİON);
    // Neo.ClientError.Schema.ConstraintValidationFailed
    // Node(54776) already exists with label `User` and property `email` = 'duplicate@email.com'
    if (exception.message.includes('already exists with')) {
      statusCode = 400;
      error = 'Bad Request';

      const [_, property] = exception.message.match(/`([a-z0-9]+)`/gi);
      message = [`${property.replace(/`/g, '')} already taken`];
    }
    // Neo.ClientError.Schema.ConstraintValidationFailed
    // Node(54778) with label `Test` must have the property `mustExist`
    else if (exception.message.includes('must have the property')) {
      statusCode = 400;
      error = 'Bad Request';

      const [_, property] = exception.message.match(/`([a-z0-9]+)`/gi);
      message = [`${property.replace(/`/g, '')} should not be empty`];
    }

    response.status(statusCode).json({
      statusCode,
      message,
      error,
    });
  }
}
