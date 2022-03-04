"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLoggerMiddleware = void 0;
const common_1 = require("@nestjs/common");
let AppLoggerMiddleware = class AppLoggerMiddleware {
    constructor() {
        this.logger = new common_1.Logger('HTTP');
    }
    use(request, response, next) {
        const { ip, method, path: url } = request;
        const userAgent = request.get('user-agent') || '';
        const requestInformation = {
            timestamp: new Date(),
            path: request.url,
            method: request.method,
            body: request.body,
            userToken: request.headers["authorization"] || null,
        };
        const now = Date.now();
        response.on('close', () => {
            const { statusCode, statusMessage, } = response;
            const responseInformation = {
                statusCode,
                statusMessage,
                responseTime: `${Date.now() - now} ms`
            };
            const logg = { requestInformation, responseInformation };
            console.log(JSON.stringify(logg));
            this.logger.log(`${logg}   `);
        });
        next();
    }
};
AppLoggerMiddleware = __decorate([
    (0, common_1.Injectable)()
], AppLoggerMiddleware);
exports.AppLoggerMiddleware = AppLoggerMiddleware;
//# sourceMappingURL=apploggermiddleware.js.map