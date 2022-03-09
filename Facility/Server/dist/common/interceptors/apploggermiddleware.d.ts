import { NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
export declare class AppLoggerMiddleware implements NestMiddleware {
    postKafka: any;
    constructor();
    private readonly i18n;
    private logger;
    use(request: Request, response: Response, next: NextFunction): void;
}
