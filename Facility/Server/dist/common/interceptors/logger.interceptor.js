"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingInterceptor = exports.LoggerInter = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const objectId_check_1 = require("../func/objectId.check");
function LoggerInter() {
    return (0, common_1.UseInterceptors)(new LoggingInterceptor());
}
exports.LoggerInter = LoggerInter;
class LoggingInterceptor {
    async intercept(context, next) {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const query = request.params;
        if (query._id) {
            (0, objectId_check_1.checkObjectIddİsValid)(query._id);
        }
        return next
            .handle()
            .pipe((0, operators_1.tap)());
    }
}
exports.LoggingInterceptor = LoggingInterceptor;
//# sourceMappingURL=logger.interceptor.js.map