"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const exception_filter_1 = require("./common/exceptionFilters/exception.filter");
const logger_interceptor_1 = require("./common/interceptors/logger.interceptor");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Facility Endpoints')
        .setDescription('Facility Transactions')
        .setVersion('1.0')
        .addTag('facility')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true
    }));
    app.useGlobalFilters(new exception_filter_1.HttpExceptionFilter());
    app.useGlobalInterceptors(new logger_interceptor_1.LoggingInterceptor());
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map