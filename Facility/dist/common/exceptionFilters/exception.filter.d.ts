import { ArgumentsHost, HttpException } from '@nestjs/common';
export declare class HttpExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void;
}
