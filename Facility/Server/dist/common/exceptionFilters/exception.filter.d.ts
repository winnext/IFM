import { I18nService } from 'nestjs-i18n';
import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly i18n;
    postKafka: any;
    constructor(i18n: I18nService);
    private logger;
    catch(exception: HttpException, host: ArgumentsHost): Promise<void>;
}
