import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { I18nService } from 'nestjs-i18n';
import { AppModule } from './app.module';
import { kafkaOptions } from './common/configs/message.broker.options';
import { kafkaConf } from './common/const/kafka.conf';
import { MinioTopis } from './common/const/kafta.topic.enum';
import { HttpExceptionFilter } from './common/exceptionFilters/exception.filter';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //to get i18nService from app module
  const i18NService = app.get<I18nService>(I18nService);

  app.connectMicroservice(kafkaOptions);
  const config = new DocumentBuilder()
    .setTitle('Minio File Microservice Endpoints')
    .setDescription('Minio File Storage Microservice Endpoints')
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
  app.enableCors();
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter(i18NService, kafkaConf, MinioTopis.MINIO_EXCEPTIONS));
  await app.startAllMicroservices();
  await app.listen(3004);
}
bootstrap();
