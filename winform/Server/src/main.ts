import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';
import { MongoExceptionFilter } from './common/exceptionFilters/mongo.exception';
import { kafkaOptions } from './common/configs/message.broker.options';
import trial from './tracing';
import { I18nService } from 'nestjs-i18n';
import { HttpExceptionFilter } from './common/exceptionFilters/exception.filter';

/**
 * Bootstrap the application
 */
async function bootstrap() {
  try {
    await trial.start();
    const app = await NestFactory.create(AppModule, { abortOnError: false });

    //to get i18nService from app module
    const i18NService = app.get<I18nService>(I18nService);

    app.connectMicroservice(kafkaOptions);

    const config = new DocumentBuilder()
      .setTitle('User Microservice Endpoints')
      .setDescription('User Transactions')
      .setVersion('1.0')
      .addTag('user')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in controller!!!
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalFilters(new MongoExceptionFilter(i18NService), new HttpExceptionFilter(i18NService));
    app.enableCors();
    await app.startAllMicroservices();
    await app.listen(3003);
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
