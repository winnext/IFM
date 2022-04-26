import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionType } from '../const/exception.type';

export function createExceptionReqResLogObj(request, exception, errorType: ExceptionType) {
  let status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

  if (errorType === ExceptionType.MONGO_EXCEPTİON) {
    status = exception.code;
  }
  const method = request.method;
  const requestInformation = {
    timestamp: new Date(),
    user: request.user || null,
    path: request.url,
    method,
    body: request.body,
  };

  const errorResponseLog = {
    timestamp: new Date().toLocaleDateString(),
    path: request.url,
    method,
    status,
    message: exception.message,
    errorType,
  };
  const reqResObject = { requestInformation, errorResponseLog };
  return reqResObject;
}
