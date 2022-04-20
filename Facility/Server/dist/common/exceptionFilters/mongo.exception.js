"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
let MongoExceptionFilter = class MongoExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        console.log('--------This error from MONGO EXCEPTİPON FİLTER-----------');
        console.log(exception);
        switch (exception.code) {
            case 112:
                response.status(409).json({ code: 409, message: 'conflict' });
                break;
            case 211:
                response.status(500).json({ code: 500, message: 'Server down' });
                break;
            case 11000:
                response.status(400).json({ code: 409, message: 'Duplicate entry' });
                break;
            case 11600:
                response.status(500).json({ code: 500, message: 'Server connection lost' });
                break;
            default:
                response.status(500).json({ code: 500, message: 'Internal server error' });
                break;
        }
    }
};
MongoExceptionFilter = __decorate([
    (0, common_1.Catch)()
], MongoExceptionFilter);
exports.MongoExceptionFilter = MongoExceptionFilter;
//# sourceMappingURL=mongo.exception.js.map