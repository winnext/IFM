import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';
import { MongoExceptionFilter } from './common/exceptionFilters/mongo.exception.filter';
import { kafkaOptions } from './common/configs/message.broker.options';
import trial from './tracing';
import { I18nService } from 'nestjs-i18n';
import { HttpExceptionFilter } from './common/exceptionFilters/http.exception.filter';
import { Neo4jErrorFilter } from './common/exceptionFilters/ne04j.exception.filter';

async function bootstrap() {
  try {
    await trial.start();
    const app = await NestFactory.create(AppModule, { abortOnError: false });
    //to get i18nService from app module
    const i18NService = app.get<I18nService>(I18nService);
    app.connectMicroservice(kafkaOptions);

    const config = new DocumentBuilder()
      .setTitle('Facility Microservice Endpoints')
      .setDescription('Facility Transactions')
      .setVersion('1.0')
      .addTag('facility')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    app.useGlobalFilters(
      new MongoExceptionFilter(i18NService),
      new HttpExceptionFilter(i18NService),
      new Neo4jErrorFilter(),
    );
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.enableCors();
    await app.startAllMicroservices();
    await app.listen(3001);
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
