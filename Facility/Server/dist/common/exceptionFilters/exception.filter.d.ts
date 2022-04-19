import { I18nService } from 'nestjs-i18n';
import { ExceptionFilter, ArgumentsHost, HttpException } from '@nestjs/common';
import { PostKafka } from '../queueService/post-kafka';
export declare class HttpExceptionFilter implements ExceptionFilter {
    private readonly i18n;
    postKafka: PostKafka;
    constructor(i18n: I18nService);
    private logger;
    catch(exception: HttpException, host: ArgumentsHost): Promise<void>;
}
