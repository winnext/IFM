import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { LoggingInterceptor } from './common/interceptors/logger.interceptor';
import { MongoExceptionFilter } from './common/exceptionFilters/mongo.exception';
import { kafkaOptions } from './common/options/message.broker.options';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, { abortOnError: false });

    app.connectMicroservice(kafkaOptions);

    const config = new DocumentBuilder()
      .setTitle('Facility Microservice Endpoints')
      .setDescription('Facility Transactions')
      .setVersion('1.0')
      .addTag('facility')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    app.useGlobalFilters(new MongoExceptionFilter());
    app.useGlobalInterceptors(new LoggingInterceptor());
    app.enableCors();
    await app.startAllMicroservices();
    await app.listen(3001);
  } catch (error) {
    console.log(error);
  }
}
bootstrap();
