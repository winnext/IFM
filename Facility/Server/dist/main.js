"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const logger_interceptor_1 = require("./common/interceptors/logger.interceptor");
const mongo_exception_1 = require("./common/exceptionFilters/mongo.exception");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, { abortOnError: false });
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Facility Microservice Endpoints')
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
        app.useGlobalFilters(new mongo_exception_1.MongoExceptionFilter());
        app.useGlobalInterceptors(new logger_interceptor_1.LoggingInterceptor());
        app.enableCors();
        await app.listen(3001);
    }
    catch (error) {
        console.log(error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map